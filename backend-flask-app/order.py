from database import query_db, select_db

def order_view(conn, user_id, order_id):
    # get order overview first
    query = """
        select money_paid, order_time from user_orders where 
        (user_id = %s and order_id = %s)
        """%(user_id, order_id)
    print(query)
    summary = select_db(conn,query)

    query = """
        select book_id from orders where
        (order_id = %s)
        """%(order_id)
    print(query)
    list = select_db(conn,query)

    result = {
        "summary": summary,
        "list": list
    }

    print(result)
    return result