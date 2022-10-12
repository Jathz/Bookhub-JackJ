import psycopg2
import sys


# define a function that handles and parses psycopg2 exceptions
def print_psycopg2_exception(err):
# get details about the exception
    err_type, err_obj, traceback = sys.exc_info()

    # get the line number when exception occured
    line_num = traceback.tb_lineno
    # print the connect() error
    print ("\npsycopg2 ERROR:", err, "on line number:", line_num)
    print ("psycopg2 traceback:", traceback, "-- type:", err_type)

    # psycopg2 extensions.Diagnostics object attribute
    print ("\nextensions.Diagnostics:", err.diag)

    # print the pgcode and pgerror exceptions
    print ("pgerror:", err.pgerror)
    print ("pgcode:", err.pgcode, "\n")
#connect to database
def connect_database():
    try:    
        conn = psycopg2.connect(
            host="localhost",
            database="comp3900",

            user="bookhub", #TODO: change this to your database user name
            password="password") #TODO: change this to your database password

    
        return conn
    # Open a cursor to perform database operations
    #cur = conn.cursor()
    except Exception as err:
        print_psycopg2_exception(err)
        print ("please re-connect the database")
        return None
    
#this is for queries beside select
def query_db(conn,query):
    if(conn is None):
        print("error: the conn is none")
        return "false"
    
    cur = conn.cursor()
    
    #query example
    #'INSERT INTO users (first_name,password,email,last_name,is_admin) Values ('kim','123','123@gmail.com','zhong','false')'
    try:
        cur.execute(query)
        conn.commit()

        cur.close()
        
        return "true"
    
    except Exception as err:
        print_psycopg2_exception(err)
        print ("query error")
        conn.rollback()
        
        try:
            cur.execute("SELECT * FROM users fetch first 10 rows only")
        except psycopg2.errors.InFailedSqlTransaction as err:
            # pass exception to function
            print_psycopg2_exception(err)
            print("rollback not executed")
        return "false"
    

#this is for select query only
def select_db(conn,query):

    

    if(conn is None):
        print("error: the conn is none")
        return None
    
    cur = conn.cursor()
    
    #query example
    #'INSERT INTO users (first_name,password,email,last_name,is_admin) Values ('kim','123','123@gmail.com','zhong','false')'
    try:
        cur.execute(query)
        conn.commit()
        result = cur.fetchall()
        cur.close()
        return result
        
    
    except Exception as err:
        print_psycopg2_exception(err)
        print ("query error")
        conn.rollback()
        
        try:
            cur.execute("SELECT * FROM users fetch first 10 rows only")
        except psycopg2.errors.InFailedSqlTransaction as err:
            # pass exception to function
            print_psycopg2_exception(err)
            print("rollback not executed")
        return None
    
#disconnect from database
def disconnect_database(conn):
    conn.close()
