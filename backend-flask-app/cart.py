from database import query_db,select_db
from datetime import datetime

def cart_add(conn, user_id, book_id):
    query = "INSERT INTO carts(user_id, book_id) VALUES ('%s', '%s')"%(user_id, book_id)   
    print(query)
    query_db(conn,query)

    return "true"

def cart_remove(conn, user_id, book_id):
    query = "delete from carts where user_id = %s and book_id = %s"%(user_id, book_id)
    print(query)
    query_db(conn, query)
    return "true"

def cart_view(conn, user_id):
    query = "select * from carts where user_id = %s"%(user_id)
    print(query)
    result = select_db(conn, query)
    return result

def cart_buy(conn, user_id):
    # Get total price of order
    query = """
        select sum(b.price) from carts c
            inner join books b on (c.book_id = b.book_id and c.user_id = %s)
            group by c.user_id
    """%(user_id)
    res = select_db(conn,query)
    money_paid = float(res[0][0])

    # Insert basic order info
    query = """
        INSERT INTO user_orders(user_id, money_paid, order_time)
        VALUES (%s, %.2f, CURRENT_TIMESTAMP)
    """%(user_id, money_paid)
    print(query)
    query_db(conn, query)

    # Get order_id of our new order
    query = """
        SELECT max(order_id) FROM user_orders
        WHERE user_id = %s
    """%(user_id)
    print(query)
    order_id = select_db(conn,query)[0][0]

    # Copy books over from cart
    query = """
        INSERT INTO orders(order_id, book_id)
        SELECT %s, book_id FROM carts WHERE
        user_id = %s
    """%(order_id, user_id)
    print(query)
    query_db(conn, query)

    # Increment number of books sold
    query = """
        UPDATE books as b
        SET number_sold = b.number_sold + 1
        FROM carts c
        WHERE b.book_id = c.book_id
        AND c.user_id = %s
    """%(user_id)
    print(query)
    query_db(conn, query)

    # Delete items from cart
    query = "DELETE FROM carts WHERE user_id = %s"%(user_id)
    print(query)
    query_db(conn, query)

    return None
 
#view books in a collection
def view_books_in_cart(user_id,conn):
    query = "select b.book_id,b.book_name,b.author,b.img_url,b.publisher,b.price from carts as bic, books as b where bic.book_id = b.book_id and user_id = %s"%(user_id)   
    print(query)
    result = select_db(conn,query)
    print(result)
    result_json = [ {"book_id":r[0],"book_name":r[1],"author":r[2],"img_url":r[3],"publisher":r[4],"price":r[5]}    for r in result]
    return result_json
    
def cart_price(user_id,conn):
	query = "select b.book_id,b.price from carts as bic, books as b where bic.book_id = b.book_id and user_id = %s"%(user_id)
	print (query)
	result = select_db(conn,query)
	print(result)
	total = 0
	for r in result:
		total= total + r[1]
	result_json = [ {"price":total}]
	return result_json
		
	
