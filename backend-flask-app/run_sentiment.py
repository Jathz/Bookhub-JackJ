from database import connect_database
from sentiment import Sentiment

conn = connect_database()
S = Sentiment()
S.sentiment_gen(conn)
