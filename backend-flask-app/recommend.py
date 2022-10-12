from database import select_db


def recommend_similar(conn, user_id):
    """
    Recommend user books based on:
    - Purchase history
    - Likes
    """
    
    # Get user's favourite genre
    query = """
        SELECT bg.genre_id, COUNT(bg.genre_id) as counter FROM user_orders uo
            INNER JOIN orders o ON
                (uo.user_id = %s and uo.order_id = o.order_id)
            INNER JOIN book_genres bg ON
                (o.book_id = bg.book_id)
        GROUP BY bg.genre_id
        ORDER BY counter DESC
    """%(user_id)
    fav_genre = select_db(conn, query)[0][0]

    # Get books in same genre, ordered by most sold that aren't in
    # the user's order history
    query = """
        SELECT * from books b
        INNER JOIN book_genres bg
            ON (b.book_id = bg.book_id and bg.genre_id = %s)
        LEFT OUTER JOIN orders o
            ON (bg.book_id = o.book_id)
        WHERE o.book_id IS NULL
        ORDER BY b.number_sold DESC
        fetch first 10 rows only
    """%(fav_genre)
    print(query)

    result =  select_db(conn, query)
    result_json = [ {"book_id":r[0],"book_name":r[1],"price":r[2],"view_number":r[3],"number_sold":r[4],"like_number":r[5],"publisher":r[6],"publish_date":r[7],"description":r[8],"img_url":r[9],"author":r[10],"number_of_pages":r[11],"language_written":r[12],"isbn":r[13],"age_restriction":r[14]}    for r in result]
    return result_json

def lst2pgarr(alist):
    strlist = ', '.join(str(e) for e in alist)
    return '(' + ''.join(strlist) + ')'

def recommend_based_on_book(conn, book_id, number):
    '''
    we have 4 types of data here.(without taking account the rating)
    the book which was bought by the user who bought the current book +4
    the book which was like by the user who brought the current book +3
    the book which was brought by the user who like the current book +2
    the book which was like by the user who like the current book +1
    
    
    Future work:
        taking consideration of rating
        taking consideration of genres similarity(clossness of genres)
    
    
    '''
    buy_buy = 4
    buy_like = 3
    like_buy = 2
    like_like = 1
    
    query = """
        select uo.user_id from user_orders uo
        join orders o on uo.order_id = o.order_id 
        where o.book_id = %s fetch first 100 rows only
    """%(book_id)
    print(query)
    book_buyers = select_db(conn,query)
    
    
    query = """
        select user_id from likes 
        where book_id = %s fetch first 100 rows only
    """%(book_id)
    print(query)

    
    book_likers = select_db(conn, query)
    
    
    book_rating = {}
    
    #rate the books buyer buy
    if(book_buyers is not None):
        for i in book_buyers:
            query = """
            select orders.book_id from orders
            join user_orders on orders.order_id = user_orders.order_id
            where user_orders.user_id = %s fetch first 100 rows only
            """%(i[0])
        
        
            books_buyers_buy = select_db(conn, query)
        
        
            for book in books_buyers_buy:
                if book[0]not in book_rating.keys():
                    book_rating[book[0]] = buy_buy
                else:
                    book_rating[book[0]] += buy_buy
    
        #rate the book that buyer like
        for i in book_buyers:
            query = """
            select book_id from likes 
            where likes.user_id = %s fetch first 100 rows only
            """%(i[0])
        
        
            books_buyers_like= select_db(conn, query)
        
        
            for book in books_buyers_like:
                if book[0] not in book_rating.keys():
                    book_rating[book[0]] = buy_like
                else:
                    book_rating[book[0]] += buy_like
    
    if(book_likers is not None):
        #rate the book that liker buy
        for i in book_likers:
            query = """
            select orders.book_id from orders
            join user_orders on orders.order_id = user_orders.order_id
            where user_orders.user_id = %s fetch first 100 rows only
            """%(i[0])
        
        
            books_likers_buy = select_db(conn, query)
        
        
            for book in books_likers_buy:
                if book[0]not in book_rating.keys():
                    book_rating[book[0]] = like_buy
                else:
                    book_rating[book[0]] += like_buy
    
        #rate the book that liker like
        for i in book_likers:
            query = """
            select book_id from likes 
            where likes.user_id = %s fetch first 100 rows only
            """%(i[0])
        
        
            books_likers_like= select_db(conn, query)
        
        
            for book in books_likers_like:
                if book[0] not in book_rating.keys():
                    book_rating[book[0]] = like_like
                else:
                    book_rating[book[0]] += like_like
    
    #sort the ratings
    if(len(book_rating)==0):
        return {"result":None}
    
    print(book_rating)
    sort_orders = sorted(book_rating.items(), key=lambda x: x[1], reverse=True)
    print(sort_orders)
    indexing = len(sort_orders) if int(number) > len(sort_orders) else int(number)
    
    top_k_book_ids = [s[0] for s in sort_orders][0:indexing]
    
    print(top_k_book_ids)
    #query those book_information from the database
    
    query = """
    select * from books where book_id in %s
    
    """%(lst2pgarr(top_k_book_ids))
    
    result = select_db(conn, query)
    print(result)
    
    result_json = [ {"book_id":r[0],"book_name":r[1],"price":r[2],"view_number":r[3],"number_sold":r[4],"like_number":r[5],"publisher":r[6],"publish_date":r[7],"img_url":r[9],"author":r[10],"number_of_pages":r[11],"language_written":r[12],"isbn":r[13],"age_restriction":r[14]}    for r in result if r is not None]
    return {"result":result_json}

def recommend_based_history(conn, user_id,number):
    book_rating = {}
    query = """
        SELECT b.book_id from books b
        LEFT OUTER JOIN orders o
            ON (b.book_id = o.book_id)
        join user_orders uo
            on (uo.order_id = o.order_id)
        where uo.user_id = %s
        ORDER BY uo.order_time
        fetch first 10 rows only
    """%(user_id)
    
    result = select_db(conn, query)
    for r in result:
        recommend_helper(conn,r[0],number,book_rating)
    
    #sort the ratings
    if(len(book_rating)==0):
        return {"result":None}
    
    print(book_rating)
    sort_orders = sorted(book_rating.items(), key=lambda x: x[1], reverse=True)
    print(sort_orders)
    indexing = len(sort_orders) if int(number) > len(sort_orders) else int(number)
    
    top_k_book_ids = [s[0] for s in sort_orders][0:indexing]
    
    query = """
    select * from books where book_id in %s
    
    """%(lst2pgarr(top_k_book_ids))
    
    result = select_db(conn, query)
    print(result)
    
    result_json = [ {"book_id":r[0],"book_name":r[1],"price":r[2],"view_number":r[3],"number_sold":r[4],"like_number":r[5],"publisher":r[6],"publish_date":r[7],"img_url":r[9],"author":r[10],"number_of_pages":r[11],"language_written":r[12],"isbn":r[13],"age_restriction":r[14]}    for r in result if r is not None]
    return {"result":result_json}
    
def recommend_helper(conn, book_id, number,book_rating):
    '''
    we have 4 types of data here.(without taking account the rating)
    the book which was bought by the user who bought the current book +4
    the book which was like by the user who brought the current book +3
    the book which was brought by the user who like the current book +2
    the book which was like by the user who like the current book +1
    
    
    Future work:
        taking consideration of rating
        taking consideration of genres similarity(clossness of genres)
    
    
    '''
    buy_buy = 4
    buy_like = 3
    like_buy = 2
    like_like = 1
    
    query = """
        select uo.user_id from user_orders uo
        join orders o on uo.order_id = o.order_id 
        where o.book_id = %s fetch first 100 rows only
    """%(book_id)
    print(query)
    book_buyers = select_db(conn,query)
    
    
    query = """
        select user_id from likes 
        where book_id = %s fetch first 100 rows only
    """%(book_id)
    print(query)

    
    book_likers = select_db(conn, query)
    
    
    
    
    #rate the books buyer buy
    if(book_buyers is not None):
        for i in book_buyers:
            query = """
            select orders.book_id from orders
            join user_orders on orders.order_id = user_orders.order_id
            where user_orders.user_id = %s fetch first 100 rows only
            """%(i[0])
        
        
            books_buyers_buy = select_db(conn, query)
        
        
            for book in books_buyers_buy:
                if book[0]not in book_rating.keys():
                    book_rating[book[0]] = buy_buy
                else:
                    book_rating[book[0]] += buy_buy
    
        #rate the book that buyer like
        for i in book_buyers:
            query = """
            select book_id from likes 
            where likes.user_id = %s fetch first 100 rows only
            """%(i[0])
        
        
            books_buyers_like= select_db(conn, query)
        
        
            for book in books_buyers_like:
                if book[0] not in book_rating.keys():
                    book_rating[book[0]] = buy_like
                else:
                    book_rating[book[0]] += buy_like
    
    if(book_likers is not None):
        #rate the book that liker buy
        for i in book_likers:
            query = """
            select orders.book_id from orders
            join user_orders on orders.order_id = user_orders.order_id
            where user_orders.user_id = %s fetch first 100 rows only
            """%(i[0])
        
        
            books_likers_buy = select_db(conn, query)
        
        
            for book in books_likers_buy:
                if book[0]not in book_rating.keys():
                    book_rating[book[0]] = like_buy
                else:
                    book_rating[book[0]] += like_buy
    
        #rate the book that liker like
        for i in book_likers:
            query = """
            select book_id from likes 
            where likes.user_id = %s fetch first 100 rows only
            """%(i[0])
        
        
            books_likers_like= select_db(conn, query)
        
        
            for book in books_likers_like:
                if book[0] not in book_rating.keys():
                    book_rating[book[0]] = like_like
                else:
                    book_rating[book[0]] += like_like
    
    


