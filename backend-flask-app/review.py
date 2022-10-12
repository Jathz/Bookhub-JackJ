from database import query_db, select_db

def rating_make(conn, user_id, book_id, rating):

    # Check if user has actually bought the book
    query = f"""
        SELECT o.rating FROM user_orders uo
        INNER JOIN orders o
            ON (uo.user_id = {user_id} and uo.order_id = o.order_id and o.book_id = {book_id})
    """
    result = select_db(conn, query)
    if (len(result)) == 0:
       return "false", "User has not ordered this book"
    
    old_rating = 0
    temp = 0
    if result[0][0] != 0:
        old_rating = result[0][0]
        temp = 1

    # Check rating within range
    if int(rating) < 1 or int(rating) > 5:
       return "false", "INTERNAL: ratings are 1-5"

    query = f"""
        UPDATE books
        SET nrated = nrated + 1 - {temp},
            rating_total = rating_total + {rating} - {old_rating}
        WHERE book_id = {book_id}
    """
    query_db(conn, query)

    query = f"""
       UPDATE orders
       SET rating = {rating}
       WHERE book_id = {book_id}
    """
    query_db(conn, query)

    return "true"

def rating_get(conn, book_id):
    query = f"""
        SELECT rating_total, nrated FROM books
        WHERE book_id = {book_id}
    """
    res = select_db(conn, query)
    if (res):
        if (res[0][1]==0):
            return{"avg": "null"}
        avg = res[0][0]/res[0][1]
        print(avg)
        return {"avg": avg}
        
    return{"avg": "null"}

def rating_get_user(conn, user_id, book_id):
    query = f"""
        SELECT o.rating FROM user_orders uo
        INNER JOIN orders o
            ON (uo.user_id = {user_id} and uo.order_id = o.order_id and o.book_id = {book_id})
    """
    res = select_db(conn, query)

    if (len(res)) == 0:
       return 0
    else :
        return res[0][0]