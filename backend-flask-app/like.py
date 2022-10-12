#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Mar 21 16:49:25 2022

@author: kimzhong
"""

from database import query_db,select_db

#like (true or false)
def like_unlike(user_id,book_id, likes,conn):

    if(likes == "true"):
        query = "INSERT INTO likes(user_id,book_id) VALUES ('%s', '%s')"%(user_id,book_id)   
        print(query)
        result = query_db(conn,query)
        
        
        return result

    else:
        query = "delete from likes where user_id = %s and book_id = %s"%(user_id,book_id)   
        print(query)
        
        result = query_db(conn,query)
        return result

    
#return if a user has like a book
def view_like(user_id,book_id,conn):
    query = "select * from likes where book_id = %s and user_id = %s"%(book_id,user_id)   
    print(query)
    result = select_db(conn,query)
    print(result)
    if result: #and result.length != 0:
        return {"like":True}
    else:
        return {'like':False}