from urllib import request
from flask import *
from flask_mail import Mail, Message
from flask_cors import CORS
import hashlib
import os
import simplejson as json
from werkzeug.utils import secure_filename

#-----------------------------------------------------------------
import valid
import database as db

from cart import cart_add, cart_remove, cart_view, cart_buy, view_books_in_cart, cart_price
from order import order_view
from sentiment import Sentiment

from book import book_add, book_edit, book_delete,book_view,book_all,book_most_likes,book_most_sold,books_by_genre,books_by_author,all_genre

from search import search_recommend

from like import like_unlike,view_like
from recommend import recommend_similar,recommend_based_on_book,recommend_based_history

from sales_analysis import summary
from review import rating_make, rating_get, rating_get_user


from collection import *
#-----------------------------------------------------------------
app = Flask(__name__)
CORS(app)


#---------------------- Email Configuration ----------------------
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'donotreply.bookhub@gmail.com'
app.config['MAIL_DEFAULT_SENDER'] = 'donotreply.bookhub@gmail.com'
app.config['MAIL_PASSWORD'] = 'unswcomp3900'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)
#-----------------------------------------------------------------
conn = db.connect_database()
#-----------------------------------------------------------------
SESSION_DURATION = 3600
EMAIL_DURATION = 3600
PASSWORD_DURATION = 1800
CONFIRM_SUBJECT = 'BookHub | Activate your email'
RESET_SUBJECT = 'BookHub | Reset your password'
DOMAIN_URL = 'http://localhost:3000'

UPLOAD_FOLDER = '/books'
app.config['UPLOAD_FOLDER'] =UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
#------------------- Sentiment ----------------------------------
sen = Sentiment()
#-----------------------------------------------------------------
#################################James's part########################
def is_admin_internal_usage(user_id):
    search = db.select_db(conn, f"SELECT is_admin FROM users WHERE user_id='{user_id}';")
    if search[0][0] == True:
        return {'is_admin': True}
    return {'is_admin': False}

# function to check if the password hash matches
def check_login(email, password):
    result = db.select_db(conn, f"SELECT password, is_verified FROM users WHERE email='{email}'")
    pwstored = result[0][0]
    pwbytes = bytes.fromhex(pwstored)
    hash = pwbytes[:32]
    salt = pwbytes[32:]
    newHash = hashlib.pbkdf2_hmac('sha256', password.encode("UTF-8"), salt, 100000)
    # check if password matches and if email has been verified
    if newHash == hash and result[0][1]:
        return True
    return False

# given the cookie token, check if the cookie is valid
@app.route('/account/session', methods=['GET', 'POST'])
def check_session():
    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    return {'valid': res['is_valid'], 'userid': res['body']}

# given an email and password, check if the credentials are correct
@app.route('/account/login', methods=['GET', 'POST'])
def login():
    login = request.json
    email = login['email']
    password = login['password']
    search = db.select_db(conn, f"SELECT COUNT(1) FROM users WHERE email='{email}'")
    if search[0][0] == 0:
        return {'error': 'ACC04', 'first': '', 'last': ''}
        # ACC04 - Email does not exist
    if check_login(email, password):
        userid = db.select_db(conn, f"SELECT user_id FROM users WHERE email='{email}'")[0][0]
        token = valid.generate_jwt_token(userid, SESSION_DURATION)
        return {'error': '', 'token': token}
    return {'error': 'ACC01', 'token': ''}
    # ACC01 - Email or password is invalid

# register a new account
@app.route('/account/register', methods=['GET', 'POST'])
def register():
    register = request.json
    email = register['email']
    first = register['first']
    last = register['last']
    search = db.select_db(conn, f"SELECT COUNT(1) FROM users WHERE email='{email}'")
    if search[0][0] == 1:
        return {'error': 'ACC02'}
        # ACC02 - Email is already in use
    password = register['password'].encode("UTF-8")
    salt = os.urandom(32)
    hash = hashlib.pbkdf2_hmac('sha256', password, salt, 100000)
    pwstored = (hash + salt).hex()
    db.query_db(conn, f"INSERT INTO users (first_name, password, email, last_name, is_admin, is_verified) Values ('{first}', '{pwstored}', '{email}', '{last}', 'false', 'false');")
    token = valid.generate_jwt_token(email, EMAIL_DURATION)
    url = DOMAIN_URL + '/confirm_email/' + token
    html = render_template('emails/confirmation.html', url=url, first=first, last=last)
    message = Message(subject=CONFIRM_SUBJECT, html=html, sender=app.config['MAIL_DEFAULT_SENDER'], recipients=[email])
    mail.send(message)
    return {'error': '', 'url': url, 'token': token}

# test endpoint
@app.route('/testing')
def testing():
    token=valid.generate_jwt_token("122345", EMAIL_DURATION)
    url = DOMAIN_URL + '/confirm_email/' + token
    print(url)
    return url

# check if the email confirmation link token is valid
@app.route('/account/confirm_email', methods=['GET', 'POST'])
def confirm_email():
    token = request.json['token']
    res = valid.decode_token(token, EMAIL_DURATION)
    if res['is_valid']:
        email = res['body']
        db.query_db(conn, f"UPDATE users SET is_verified = 'true' WHERE email='{email}';")
        return {'error': ''}
    return {'error': 'ACC03'}
    # ACC03 - Email link is either invalid or expired


# return back the user when given an email
@app.route('/account/get_user', methods=['POST', 'GET'])
def get_user():
    email = request.json['email']
    search = db.select_db(conn, f"SELECT COUNT(1) FROM users WHERE email='{email}'")
    if search[0][0] == 0:
        return {'error': 'ACC04', 'first': '', 'last': ''}
        # ACC04 - Email does not exist
    res = db.select_db(conn, f"SELECT first_name, last_name FROM users WHERE email='{email}'")
    return {'error': '', 'first': res[0][0], 'last': res[0][1]}


@app.route('/account/make_admin', methods=['POST', 'GET'])
def make_admin():
    email = request.json['email']
    search = db.select_db(conn, f"SELECT COUNT(1) FROM users WHERE email='{email}'")
    if search[0][0] == 0:
        return {'error': 'ACC04'}
        # ACC04 - Email does not exist
    db.query_db(conn, f"UPDATE users SET is_admin = 'true' WHERE email='{email}';")
    return {'error':''}

@app.route('/account/is_admin', methods=['POST', 'GET'])
def is_admin():
    token = request.get_json()['token']
    res = valid.decode_token(token, SESSION_DURATION)
    if res['is_valid']:
        user_id = res['body']
        search = db.select_db(conn, f"SELECT is_admin FROM users WHERE user_id='{user_id}';")
        if search and search[0][0] == True:
            return {'is_admin': True}
    return {'is_admin': False}

@app.route('/account/get_details', methods=['POST', 'GET'])
def get_details():
    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    search = db.select_db(conn, f"SELECT first_name, last_name, email FROM users WHERE user_id='{user_id}';")
    return {'first': search[0][0], 'last': search[0][1], 'email': search[0][2]}

@app.route('/account/update', methods=['POST', 'GET'])
def update_details():
    token = request.json['token']
    first = request.json['first']
    last = request.json['last']
    email = request.json['email']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']

    search = db.select_db(conn, f"SELECT COUNT(1) FROM users WHERE email='{email}' AND user_id<>{user_id}")
    if search[0][0] == 1:
        return {'error': 'ACC02'}
        # ACC02 - Email is already in use

    if request.json['password']:
        password = request.json['password'].encode("UTF-8")
        salt = os.urandom(32)
        hash = hashlib.pbkdf2_hmac('sha256', password, salt, 100000)
        pwstored = (hash + salt).hex()
        db.query_db(conn, f"UPDATE users SET password='{pwstored}' WHERE user_id={user_id};")

    db.query_db(conn, f"UPDATE users SET first_name='{first}', last_name='{last}', email='{email}' WHERE user_id={user_id};")
    return {'error': ''}

@app.route('/account/reset_password', methods=['POST'])
def reset_password():
    email = request.json['email']
    print(email)
    search = db.select_db(conn, f"SELECT COUNT(1) FROM users WHERE email='{email}';")
    if search[0][0] == 0:
        return {'error': 'ACC04'}
        # ACC04 - Email does not exist
    print("test")
    token = valid.generate_jwt_token(email, PASSWORD_DURATION)
    url = DOMAIN_URL + '/reset-password/' + token
    print(url)
    html = render_template('emails/password.html', url=url)
    message = Message(subject=RESET_SUBJECT, html=html, sender=app.config['MAIL_DEFAULT_SENDER'], recipients=[email])
    mail.send(message)
    return {'error': ''}

@app.route('/account/change_password', methods=['POST'])
def change_password():
    token = request.json['token']
    res = valid.decode_token(token, EMAIL_DURATION)
    if res['is_valid']:
        email = res['body']
        password = request.json['password'].encode("UTF-8")
        salt = os.urandom(32)
        hash = hashlib.pbkdf2_hmac('sha256', password, salt, 100000)
        pwstored = (hash + salt).hex()
        db.query_db(conn, f"UPDATE users SET password='{pwstored}' WHERE email='{email}';")
        return {'error': ''}
    return {'error': 'ACC03'}
    # ACC03 - Email link is either invalid or expired

# TODO: Remove/update this placeholder
@app.route('/book/front_test', methods= ['POST'])
def front_test():
    if request.method == 'POST':
        res = db.select_db(conn, f"SELECT book_name, img_url, book_id FROM books WHERE price=100;")
        end = {"result":[]}
        for i in res[:10]:
            end["result"].append({"id":i[2], "img":i[1], "title":i[0]})
        return end

# temporary get_favourites function - remove if duplicate
@app.route('/book/get_favourites', methods=['POST', 'GET'])
def get_favourites():
    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    res = db.select_db(conn, f"SELECT book_name, img_url, book_id FROM books WHERE book_id IN (SELECT book_id FROM likes WHERE user_id={user_id});")
    end = {"result":[]}
    for i in res[:10]:
            end["result"].append({"id":i[2], "img":i[1], "title":i[0]})
    return end

@app.route('/book/get_chapters', methods=['POST', 'GET'])
def get_chapters():
    book_id = request.json['id']
    res = db.select_db(conn, f"SELECT chapter_num, book_pdf_path FROM book_chapters WHERE book_id={book_id};")
    end = {"result":[]}
    for i in res:
        end["result"].append({"chapter":i[0], "path":i[1]})
    return end

@app.route('/book/get_all_favourites', methods=['POST', 'GET'])
def get_all_favourites():
    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    print(user_id)
    res = db.select_db(conn, f"SELECT book_name, img_url, book_id, author FROM books WHERE book_id IN (SELECT book_id FROM likes WHERE user_id={user_id});")
    end = {"result":[]}
    for i in res:
            end["result"].append({"id":i[2], "img":i[1], "title":i[0], "author":i[3]})
    return end

@app.route('/book/get_all_my_books', methods=['POST', 'GET'])
def get_all_my_books():
    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    print(user_id)
    #res = db.select_db(conn, f"SELECT order_id FROM user_orders WHERE user_id={user_id}")
    res = db.select_db(conn, f"SELECT book_name, img_url, book_id, author FROM books WHERE book_id IN (SELECT book_id FROM orders WHERE order_id IN (SELECT order_id FROM user_orders WHERE user_id={user_id}));")
    end = {"result":[]}
    for i in res:
            end["result"].append({"id":i[2], "img":i[1], "title":i[0], "author":i[3]})
    return end

@app.route('/book/get_my_books', methods=['POST', 'GET'])
def get_my_books():
    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    res = db.select_db(conn, f"SELECT book_name, img_url, book_id FROM books WHERE book_id IN (SELECT book_id FROM orders WHERE order_id IN (SELECT order_id FROM user_orders WHERE user_id={user_id}));")
    end = {"result":[]}
    for i in res[:10]:
            end["result"].append({"id":i[2], "img":i[1], "title":i[0]})
    return end

@app.route('/book/add_to_wishlist', methods=['POST'])
def add_to_wishlist():
    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    print(user_id)
    book_id = request.get_json()['book_id']
    query = "INSERT INTO wishlists(user_id, book_id) VALUES ('%s', '%s')"%(user_id, book_id)
    query_db(conn, query)
    result = "true"
    # serialize return
    return json.dumps({"result":result})

@app.route('/book/get_all_wishlist', methods=['POST', 'GET'])
def get_all_wishlists():
    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    print(user_id)
    res = db.select_db(conn, f"SELECT book_name, img_url, book_id, author FROM books WHERE book_id IN (SELECT book_id FROM wishlists WHERE user_id={user_id});")
    end = {"result":[]}
    for i in res:
            end["result"].append({"id":i[2], "img":i[1], "title":i[0], "author":i[3]})
    return end

@app.route('/book/get_wishlist', methods=['POST', 'GET'])
def get_wishlists():
    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    print(user_id)
    res = db.select_db(conn, f"SELECT book_name, img_url, book_id FROM books WHERE book_id IN (SELECT book_id FROM wishlists WHERE user_id={user_id});")
    end = {"result":[]}
    for i in res[:10]:
            end["result"].append({"id":i[2], "img":i[1], "title":i[0]})
    return end

@app.route('/book/top_sellers', methods= ['GET'])
def top_sellers():
    if request.method == 'GET':
        res = db.select_db(conn, f"SELECT book_name, img_url, book_id FROM books ORDER BY number_sold DESC;")
        end = {"result":[]}
        for i in res[:10]:
            end["result"].append({"id":i[2], "img":i[1], "title":i[0]})
        return end

@app.route('/book/new_releases', methods= ['GET'])
def new_releases():
    if request.method == 'GET':
        res = db.select_db(conn, f"SELECT book_name, img_url, book_id FROM books ORDER BY publish_date DESC;")
        end = {"result":[]}
        for i in res[:10]:
            end["result"].append({"id":i[2], "img":i[1], "title":i[0]})
        return end
    
#################################James's part end########################

#################################Kim's part##############################
#test connnection
@app.route("/test")
def test():
    if request.method == 'GET':
        return {"result":"connected"}


@app.route("/book/add",methods = ['POST'])
def add_book():
    #check the request type
    if request.method != 'POST':
        return "error request type"
    #authentication

    token = request.get_json()['token']
    decoded_token = valid.decode_token(token, SESSION_DURATION)
    print(decoded_token['is_valid'])
    if(decoded_token['is_valid']==False):
        print(decoded_token['is_valid'])
        return "error invalid token"
    
    user_id = decoded_token['body']
    if (is_admin_internal_usage(user_id)['is_admin'] == False):
        return "error you are not admin"
    #extract data
    name = request.get_json()['name']
    price = request.get_json()['price']#need to integer this it is a string
    publisher = request.get_json()['publisher']
    publish_date = request.get_json()['publish_date']
    description = request.get_json()['description']
    genres = request.get_json()['genres']#a list of genres
    image = request.get_json()['image'] #IT IS A URL STORED IN IMGUR
    author = request.get_json()['author']
    num = request.get_json()['number_of_pages']
    isbn = request.get_json()['isbn']
    language = request.get_json()['language_written']
    age_restriction = request.get_json()['age_restriction']

    #interact with databse
    result = book_add(name,price,publisher,publish_date,description,conn,genres,image,author,num,isbn,language,age_restriction)
    #need to jsonify the output
    return {"result":result}

@app.route("/book/delete",methods = ['POST'])
def delete_book():
    #check the request type
    if request.method != 'POST':
        return "error request type"
    #authentication

    token = request.json['token']
    decoded_token = valid.decode_token(token, SESSION_DURATION)
    if(decoded_token['is_valid']==False):
        return "error invalid token"
    
    user_id = decoded_token['body']
    if (is_admin_internal_usage(user_id)['is_admin'] == False):
        return "error you are not admin"
    #extract data
    book_id = request.get_json()['id'] 
    

    #interact with databse
    result = book_delete(book_id,conn)
    #need to jsonify the output
    return {"result":result}

@app.route("/book/edit",methods = ['POST'])
def edit_book():
    #check the request type
    if request.method != 'POST':
        return "error request type"
    #authentication

    token = request.get_json()['token']
    decoded_token = valid.decode_token(token, SESSION_DURATION)
    if(decoded_token['is_valid']==False):
        return "error invalid token"
    
    user_id = decoded_token['body']
    if (is_admin_internal_usage(user_id)['is_admin'] == False):
        return "error you are not admin"
    
    #extract data
    book_id = request.get_json()['id']
    name = request.get_json()['name']
    price = request.get_json()['price']#need to integer this it is a string
    publisher = request.get_json()['publisher']
    publish_date = request.get_json()['publish_date']
    description = request.get_json()['description']
    genres = request.get_json()['genres']#a list of genres
    image = request.get_json()['image'] #IT IS A URL STORED IN IMGUR
    author = request.get_json()['author']
    num = request.get_json()['number_of_pages']
    isbn = request.get_json()['isbn']
    language = request.get_json()['language_written']
    age = request.get_json()['age_restriction']

    #interact with databse
    result = book_edit(name,price,publisher,publish_date,description,book_id,conn,genres,image,author,num,isbn,language,age)
    #need to jsonify the output
    return {"result":result}

@app.route("/book/view",methods = ['GET'])
def view_book():
    #check the request type
    if request.method != 'GET':
        return "error request type"
        
    #extract data
    book_id = request.args.get("id")

    #interact with databse
    result = book_view(book_id,conn)
    #need to jsonify the output
    return json.dumps({"result":result},use_decimal=True,default=str)

@app.route("/search",methods = ['GET'])
def search_result():
    #check the request type
    if request.method != 'GET':
        return "error request type"
        
    #extract data
    query = request.args.get("query")

    #interact with databse
    result = search_recommend(query, conn)
    #need to jsonify the output
    return json.dumps({"result":result},use_decimal=True,default=str)


@app.route("/book/most_sold",methods = ['GET'])
def view_most_sold_book():
    #check the request type
    if request.method != 'GET':
        return "error request type"

    #interact with databse
    result = book_most_sold(conn)
    #need to jsonify the output
    return json.dumps({"result":result},use_decimal=True,default=str)

@app.route("/book/most_likes",methods = ['GET'])
def view_most_likes_book():
    #check the request type
    if request.method != 'GET':
        return "error request type"

    #interact with databse
    result = book_most_sold(conn)
    #need to jsonify the output
    return json.dumps({"result":result},use_decimal=True,default=str)

@app.route("/book/all",methods = ['GET'])
def view_all_book():
    #check the request type
    if request.method != 'GET':
        return "error request type"

    #interact with databse
    result = book_all(conn)
    #need to jsonify the outpu
    return json.dumps({"result":result},use_decimal=True,default=str)

@app.route("/book/by_genre",methods = ['GET'])
def genre_book():
    #check the request type
    if request.method != 'GET':
        return "error request type"

    #extract data
    genre_id = request.args.get("genre_id")

    
    #interact with databse
    result = books_by_genre(genre_id,conn)
    #need to jsonify the output
    return json.dumps({"result":result},use_decimal=True,default=str)

@app.route("/book/by_author",methods = ['GET'])
def author_book():
    #check the request type
    if request.method != 'GET':
        return "error request type"

    #extract data
    author = request.args.get("author")

    
    #interact with databse
    result = books_by_author(author,conn)
    #need to jsonify the output
    return json.dumps({"result":result},use_decimal=True,default=str)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
#dont look at this one
@app.route('/book_img/upload', methods = ['POST'])
def upload_book_img():
    if request.method == 'POST':
        # check if the post request has the file part

        #authentication
        token = request.json['token']
        decoded_token = valid.decode_token(token, SESSION_DURATION)
        if(decoded_token['is_valid']==False):
            return "error invalid token"
        
        user_id = decoded_token['body']
        if (is_admin_internal_usage(user_id)['is_admin'] == False):
            return "error you are not admin"
        
        if 'file' not in request.files:
            flash('No file part')
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(filename)
    return {"result":"success"}

#dont look at this one
@app.route('/download_book_img/<name>', methods = ['GET'])
def download_file(name):
    return send_from_directory(app.config["UPLOAD_FOLDER"], name)

#like unlike below
#like or unlike a book
@app.route("/book/like",methods = ['POST'])
def like_unlike_book():
    #check the request type
    if request.method != 'POST':
        return "error request type"
    #authentication
    
    #extract data
    book_id = request.get_json()['book_id']
    #authentication
    token = request.get_json()['token']
    decoded_token = valid.decode_token(token, SESSION_DURATION)
    if(decoded_token['is_valid']==False):
        return "error invalid token"
    
    user_id = decoded_token['body']
    likes = request.get_json()['likes']#need to integer this it is a string
    
    #interact with databse
    result = like_unlike(user_id,book_id,likes,conn)
    #need to jsonify the output
    return {"result":result}

@app.route("/book/check_like",methods = ['POST'])
def check_like():
    #check the request type
    if request.method != 'POST':
        return "error request type"
    #extract data
    book_id = request.get_json()['book_id']
    #authentication
    token = request.get_json()['token']

    decoded_token = valid.decode_token(token, SESSION_DURATION)
    if(decoded_token['is_valid']==False):
        return "error invalid token"
    
    user_id = decoded_token['body']
    
    #interact with databse
    result = view_like(user_id,book_id,conn)
    #need to jsonify the output
    return {"result":result}

#collection below
@app.route("/collection/view_collections",methods = ['GET'])
def collection_view():
    #check the request type
    if request.method != 'GET':
        return "error request type"
    #extract data
    #authentication
    token = request.args.get('token')
    decoded_token = valid.decode_token(token, SESSION_DURATION)
    if(decoded_token['is_valid']==False):
        return "error invalid token"
    
    user_id = decoded_token['body']
    
    #interact with databse
    result = view_collection(user_id,conn)
    #need to jsonify the output
    return {"result":result}

@app.route("/collection/get_collection_details", methods = ['POST'])
def collction_details():
    if request.method != 'POST':
        return "error request type"

    collection_id = request.get_json()['collection_id']
    result = details_collection(collection_id,conn)
    return {"result":result}

@app.route("/collection/check_is_owner", methods = ['POST'])
def check_owner():
    if request.method != 'POST':
        return "error request type"

    collection_id = request.get_json()['collection_id']
    token = request.get_json()['token']
    decoded_token = valid.decode_token(token, SESSION_DURATION)
    if(decoded_token['is_valid']==False):
        return "error invalid token"
    
    user_id = decoded_token['body']

    result = check_is_owner(collection_id,user_id,conn)
    return {"result":result}

@app.route("/collection/view_books",methods = ['GET'])
def books_in_a_collection_view():
    #check the request type
    if request.method != 'GET':
        return "error request type"
    
    #extract data
    collection_id= request.args.get("collection_id")
    
    #interact with databse
    result = view_books_in_collection(collection_id, conn) 
    #need to jsonify the output
    return {"result":result}

@app.route("/collection/create_collection",methods = ['POST'])
def collection_create():
    #check the request type
    if request.method != 'POST':
        return "error request type"
    #authentication
    
    #extract data

    #authentication
    token = request.json['token']
    decoded_token = valid.decode_token(token, SESSION_DURATION)
    if(decoded_token['is_valid']==False):
        return "error invalid token"
    
    user_id = decoded_token['body']
    title = request.get_json()['title']
    description = request.get_json()['description']
    
    #interact with databse
    result, collection_id =  create_collection(user_id,title,description,conn)
    #need to jsonify the output
    return {"result":result, "collection_id": collection_id}

@app.route("/collection/edit_collection",methods = ['POST'])
def collection_edit():
    #check the request type
    if request.method != 'POST':
        return "error request type"
    #authentication
    token = request.json['token']
    decoded_token = valid.decode_token(token, SESSION_DURATION)
    if(decoded_token['is_valid']==False):
        return "error invalid token"
    
    user_id = decoded_token['body']
    #extract data
    collection_id = request.get_json()['collection_id']
    title = request.get_json()['title']
    description = request.get_json()['description']
    
    #interact with databse
    result =  edit_collection(collection_id, user_id,title,description,conn)
    #need to jsonify the output
    return {"result":result}

@app.route("/collection/delete_collection",methods = ['POST'])
def collection_delete():
    #check the request type
    if request.method != 'POST':
        return "error request type"
    #authentication
    #authentication
    token = request.json['token']
    decoded_token = valid.decode_token(token, SESSION_DURATION)
    if(decoded_token['is_valid']==False):
        return "error invalid token"
    
    user_id = decoded_token['body']
    
    #extract data
    collection_id = request.get_json()['collection_id']
    
    #interact with databse
    result = delete_collection(collection_id, user_id, conn)
    #need to jsonify the output
    return {"result":result}

@app.route("/collection/copy_collection",methods = ['POST'])
def collection_copy():
    #check the request type
    if request.method != 'POST':
        return "error request type"
    #authentication
    token = request.json['token']
    decoded_token = valid.decode_token(token, SESSION_DURATION)
    if(decoded_token['is_valid']==False):
        return "error invalid token"
    
    user_id = decoded_token['body']
    
    #extract data
    collection_id = request.get_json()['collection_id']
    
    #interact with databse
    result = copy_a_collection(user_id, collection_id, conn)
    #need to jsonify the output
    return {"result":result}

@app.route("/collection/add_book",methods = ['POST'])
def collection_add_book():
    #check the request type
    if request.method != 'POST':
        return "error request type"
    #authentication
    token = request.json['token']
    decoded_token = valid.decode_token(token, SESSION_DURATION)
    if(decoded_token['is_valid']==False):
        return "error invalid token"
    
    #extract data
    book_id = request.get_json()['book_id']
    collection_id = request.get_json()['collection_id']
    #interact with databse
    result = add_to_collection(collection_id, book_id, conn)
    #need to jsonify the output
    return {"result":result}

@app.route("/collection/delete_book",methods = ['POST'])
def collection_delete_book():
    #check the request type
    if request.method != 'POST':
        return "error request type"
    #authentication
    token = request.json['token']
    decoded_token = valid.decode_token(token, SESSION_DURATION)
    if(decoded_token['is_valid']==False):
        return "error invalid token"
    
    #extract data
    book_id = request.get_json()['book_id']
    collection_id = request.get_json()['collection_id']
    
    #interact with databse
    result =remove_from_collection(collection_id, book_id, conn)
    #need to jsonify the output
    return {"result":result}

@app.route("/book_store_analysis_summary",methods = ['GET'])
def analysis_summary():
    #check the request type
    if request.method != 'GET':
        return "error request type"
    
    
    #authentication
    '''
    token = request.json['token']
    decoded_token = valid.decode_token(token, SESSION_DURATION)
    if(decoded_token['is_valid']==False):
        return "error invalid token"
    
    user_id = decoded_token['body']
    if (is_admin_internal_usage(user_id)['is_admin'] == False):
        return "error you are not admin"
    #extract data
    '''
    #interact with databse
    result = summary(conn)
    #need to jsonify the output
    return json.dumps({"result":result},use_decimal=True,default=str)


####################################End of Kim's part####################

####################################Andy's part##########################
"""
Shopping cart
"""

@app.route('/cart/view', methods=['GET'])
def route_cart_view():
    # Check the request type
    if request.method != 'GET':
        return "error request type"

    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    print(user_id)
	
    user_id = request.args.get("user_id")
    result = cart_view(conn, user_id)

    return json.dumps({'result':result})


@app.route('/cart/add', methods=['POST'])
def route_cart_add():
    # Check the request type
    if request.method != 'POST':
        return "error request type"

    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    print(user_id)

    book_id = request.get_json()['book_id']
    #user_id = request.form["user_id"]
    #book_id = request.form["book_id"]
    print("test")
    # add to cart
    result = cart_add(conn, user_id, book_id)

    # serialize return
    return json.dumps({"result":result})

@app.route('/cart/remove', methods=['POST'])
def route_cart_remove():
    # Check the request type
    if request.method != 'POST':
        return "error request type"

    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    print(user_id)

    book_id = request.get_json()['book_id']
    #user_id = request.form["user_id"]
    #book_id = request.form["book_id"]

    # add to cart
    result = cart_remove(conn, user_id, book_id)

    # serialize return
    return json.dumps({"result":result})

@app.route('/cart/buy', methods=['POST'])
def route_cart_buy():
    if request.method != 'POST':
        return "error request type"

    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    print(user_id)

    result = cart_buy(conn, user_id)

    return json.dumps({"result":result})

@app.route('/order/view', methods=['GET'])
def route_order_view():
    # Check the request type
    if request.method != 'GET':
        return "error request type"

    user_id = request.args.get("user_id")
    order_id = request.args.get("order_id")

    result = order_view(conn, user_id, order_id)
@app.route("/cart/view_books",methods = ['POST'])
def books_in_a_cart_view():
    #check the request type
    if request.method != 'POST':
        return "error request type"
    #extract data
    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    print(user_id)
    
    #interact with databse
    result = view_books_in_cart(user_id, conn) 
    #need to jsonify the output
    return {"result":result}

@app.route("/cart/price",methods = ['POST'])
def route_cart_price():
    #check the request type
    if request.method != 'POST':
        return "error request type"
    #extract data
    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']
    print(user_id)
    
    #interact with databse
    result = cart_price(user_id, conn) 
    #need to jsonify the output
    return {"result":result}
    
@app.route("/genre",methods = ['GET'])
def route_all_genre():
    if request.method != 'GET':
        return "error request type"
    result = all_genre(conn)
    
    return{"result":result}

@app.route("/sentiment/top",methods = ['GET'])
def route_sentiment_top():
    #check the request type
    if request.method != 'GET':
        return "error request type"

    #interact with databse
    result = sen.sentiment_top()
    end = {"result":[]}
    for i in result:
        res = db.select_db(conn, f"SELECT book_name, img_url, book_id FROM books WHERE book_id={i};")
        end["result"].append({"id":res[0][2], "img":res[0][1], "title":res[0][0]})
    #need to jsonify the output
    return json.dumps({"result":end}, default=str)

@app.route("/recommend/get", methods = ['GET'])
def route_recommend_similar():
    #check the request type
    if request.method != 'GET':
        return "error request type"

    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']

    #interact with databse
    result = recommend_similar(conn, user_id)

    #need to jsonify the output
    return json.dumps({"result":result},use_decimal=True,default=str)

@app.route("/recommend/history", methods = ['POST', 'GET'])
def route_recommend_history():
    #check the request type
    #if request.method != 'GET':
    #    return "error request type"

    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']

    #interact with databse
    result = recommend_based_history(conn, user_id,20)

    #need to jsonify the output
    return json.dumps({"result":result},use_decimal=True,default=str)

@app.route('/rating/rate', methods=['POST'])
def route_rating_rate():
    if request.method != 'POST':
        return "error request type"

    token = request.json['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']

    book_id = request.get_json()['book_id']
    rating = request.get_json()['rating']
    result = rating_make(conn, user_id, book_id, rating)

    return json.dumps({"result":result}, default=str)

@app.route("/rating/get", methods = ['GET'])

def route_rating_get():
    #check the request type
    if request.method != 'GET':
        return "error request type"

    book_id = request.args.get("book_id")

    #interact with databse
    result = rating_get(conn, book_id)

    #need to jsonify the output
    return json.dumps({"result":result}, default=str) 

@app.route("/rating/get_user", methods = ['POST'])
def route_user_rating_get():
    #check the request type
    if request.method != 'POST':
        return "error request type"

    token = request.get_json()['token']
    res = valid.decode_token(token, SESSION_DURATION)
    user_id = res['body']

    book_id = request.get_json()["book_id"]

    #interact with databse
    result = rating_get_user(conn, user_id, book_id)

    #need to jsonify the output
    return json.dumps({"result":result}, default=str) 

@app.route("/recommend_based_on_book", methods = ['GET'])
def recommend_by_book():
    #check the request type
    if request.method != 'GET':
        return "error request type"

    book_id = request.args.get("book_id")
    number = request.args.get("number")
    #interact with databse
    result = recommend_based_on_book(conn, book_id,number)

    #need to jsonify the output
    return json.dumps({"result":result}, default=str) 
####################################End of Andy's part##########################

if __name__ == '__main__':
    app.run()
