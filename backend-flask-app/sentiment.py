#!/usr/bin/env python3

from re import A
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer as SIA
import praw
import datetime as dt
import pandas as pd

import database as db
from database import query_db, select_db

class Sentiment:
    def __init__(self):
        nltk.download('vader_lexicon')
        nltk.download('stopwords')

        self.reddit = praw.Reddit(client_id='Lsw7JQQ_0SHKyD1CkVTcjA',
                            client_secret='3pY1b-rM4g0yHSmUG9H4VPHQ-JWomw',
                            user_agent='iloveDRS') ## to use this, make a Reddit app. Client ID is in top left corner, client secret is given, and user agent is the username that the app is under

    def commentSentiment(self, urlT):
        subComments = []
        bodyComment = []
        try:
            check = self.reddit.submission(url=urlT)
            subComments = check.comments
        except:
            return 0

        for comment in subComments:
            try:
                bodyComment.append(comment.body)
            except:
                return 0

        sia = SIA()
        results = []
        for line in bodyComment:
            scores = sia.polarity_scores(line)
            scores['headline'] = line

            results.append(scores)

        df = pd.DataFrame.from_records(results)
        df.head()
        df['label'] = 0

        try:
            df.loc[df['compound'] > 0.1, 'label'] = 1
            df.loc[df['compound'] < -0.1, 'label'] = -1
        except:
            return 0

        averageScore = 0
        position = 0
        while position < len(df.label)-1:
            averageScore = averageScore + df.label[position]
            position += 1
        averageScore = averageScore/len(df.label)

        return(averageScore)

    def latestComment(self, urlT):
        subComments = []
        updateDates = []
        try:
            check = self.reddit.submission(url=urlT)
            subComments = check.comments
        except:
            return 0

        for comment in subComments:
            try:
                updateDates.append(comment.created_utc)
            except:
                return 0

        updateDates.sort()
        return(updateDates[-1])

    def get_date(date):
        return dt.datetime.fromtimestamp(date)

    def sentiment_gen(self, conn):
        query = """
            select book_id, book_name from books
        """
        books_db = select_db(conn, query)
        books = {}

        for book_id, book_name in books_db:
            books[book_id] = book_name

        print(books)

        submission_statistics = []
        d = {}
        for book_id in books:
            book_name = books[book_id]

            for submission in self.reddit.subreddit('books').search(book_name, time_filter="month", limit=5):
                if submission.domain != "self.books":
                    continue

                d = {}
                d['id'] = book_id
                d['book_name'] = book_name
                d['num_comments'] = submission.num_comments
                d['comment_sentiment_average'] = self.commentSentiment(submission.url)

                if d['comment_sentiment_average'] == 0.000000:
                    continue

                d['upvote_ratio'] = submission.upvote_ratio
                d['author'] = submission.author
                submission_statistics.append(d)

        dfSentimentBooks = pd.DataFrame(submission_statistics)
        print(dfSentimentBooks)
        print(dfSentimentBooks.groupby("id").mean().sort_values("comment_sentiment_average", ascending=False))

        dfSentimentBooks.groupby("id").mean().sort_values("comment_sentiment_average",ascending=False).rename_axis("book", axis=1).to_csv('Reddit_Sentiment.csv', index=True)

    def sentiment_top(self):
        """
        Extract sentiment analysis from CSV
        """
        try:
            df = pd.read_csv("Reddit_Sentiment.csv")
            ret = df["id"].head(5).tolist()
            print(ret)
            return ret
        except FileNotFoundError:
            print("Generate sentiment first!")
            return []