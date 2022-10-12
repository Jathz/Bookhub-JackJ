#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Apr  8 16:18:41 2022

@author: kimzhong
"""
from dateutil.relativedelta import relativedelta

from datetime import date
from database import query_db,select_db

#book number
def book_number_total(conn):
    query = "select count(book_id) select from books"
    book_number=select_db(conn,query)
    
    return book_number
#users number
def user_number_total(conn):
    query = "select count(user_id) from users"
    user_number=select_db(conn,query)
    return user_number

#number of sales
def total_sales(conn):
    query = "select sum(money_paid) from user_orders;"
    sales=select_db(conn,query)
    return sales

#annual revenue
def annual_revenue(conn):
    query = "select sum(money_paid) from user_orders where order_time > '%s-01-01' and order_time < '%s-01-01';"%(str(date.today().year),str(date.today().year+1))
    sales=select_db(conn,query)
    return sales

#month revenue 
def monthly_revenue(conn):
    today = date.today()

    next_month = today + relativedelta(months=+1)
    
    query = "select sum(money_paid) from user_orders where order_time > '%s-%s-01' and order_time < '%s-%s-01';"%(today.strftime("%Y"),today.strftime("%m"),next_month.strftime("%Y"),next_month.strftime("%m"))
    sales=select_db(conn,query)
    return sales
def last_12_months_revenue(conn):
    today = date.today()
    result = []
    for i in range(0,12):
        delta_month = today - relativedelta(months=+i)
    
        query = "select sum(money_paid) from user_orders where order_time > '%s-%s-01' and order_time < '%s-%s-01';"%(today.strftime("%Y"),today.strftime("%m"),delta_month.strftime("%Y"),delta_month.strftime("%m"))
        sales=select_db(conn,query)
        result.append(sales)
    return result

#Author with most likes
def most_popular_author(conn):
    query = "select author,sum(books.likes_number) from books group by author order by author desc fetch first 1 rows only;"
    author = select_db(conn,query)
    return author

def summary(conn):
    return {"total_number_book":book_number_total(conn),
            "user_number_total":user_number_total(conn),
            "total_sales":total_sales(conn),
            "annual_revenue":annual_revenue(conn),
            "monthly_revenue":monthly_revenue(conn),
            "last_12_months_revenue":last_12_months_revenue(conn),
            "most_popular_author":most_popular_author(conn),
            "most_popular_genre":most_popular_genre(conn)}
#TODO:FIX THIS
#genre with most purchase
def most_popular_genre(conn):
    query = "select g.genre_id,sum(b.number_sold) from books as b join book_genres as bg where b.book_id = bg.book_id group by bg.genre_id order by b.author desc fetch first 1 rows only;"
    author = select_db(conn,query)
    return author

