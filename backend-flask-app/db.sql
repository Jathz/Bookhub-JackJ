drop user bookhub;
create user bookhub password 'password' superuser;


DROP DATABASE IF EXISTS comp3900;
CREATE DATABASE comp3900 WITH ENCODING 'UTF8';

DROP TABLE IF EXISTS users;
CREATE TABLE users (
        user_id serial PRIMARY KEY,
        first_name VARCHAR ( 50 ) NOT NULL,
        password VARCHAR ( 255 ) NOT NULL,
        email VARCHAR ( 255 ) UNIQUE NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	is_admin BOOLEAN NOT NULL,
        is_verified BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS admins;
CREATE TABLE admins(
        user_id integer primary key references users NOT NULL
);

DROP TABLE IF EXISTS buyers;
#gender is integer 0 for male, 1 for female, 2 for else;
CREATE TABLE buyers(
	user_id integer primary key references users NOT NULL,
	age integer,
	gender integer,
	address VARCHAR(255)
);

DROP TABLE IF EXISTS authors;
CREATE TABLE authors(
	author_id serial PRIMARY KEY,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	brief VARCHAR(255)
);

DROP TABLE IF EXISTS comments;
CREATE TABLE comments(
        comment_id serial PRIMARY KEY,
        comment VARCHAR(255) NOT NULL,
        user_id integer references users NOT NULL,
        date_commented Date NOT NULL
)

DROP TABLE IF EXISTS books;
CREATE TABLE books(
	book_id serial PRIMARY KEY,
        book_name VARCHAR(255) NOT NULL,
	price numeric NOT NULL,
        view_number integer DEFAULT 0,
	number_sold integer DEFAULT 0,
	likes_number integer DEFAULT 0,
	publisher VARCHAR(255),
	publish_date Date,
	description VARCHAR(255),
    img_url VARCHAR(255), /*THIS IS ONLY USED WHEN THERE IS ONLY ONE IMG*/
    author VARCHAR(255) NOT NULL,/*use this for now*/
    number_of_pages integer,
    language_written varchar(255),
    isbn varchar(255),
    age_restriction varchar(255),
    pdf varchar(255),
    rating_total numeric DEFAULT 0,
    nrated integer DEFAULT 0
);

DROP TABLE IF EXISTS genres;
CREATE TABLE genres(
    genre_id serial primary key,
    genre_description VARCHAR(255) NOT NULL
);


DROP TABLE IF EXISTS book_genres;
CREATE TABLE book_genres(
    book_id integer references books NOT NULL,
    genre_id integer references genres NOT NULL,
    PRIMARY KEY(book_id,genre_id)
);

DROP TABLE IF EXISTS book_chapters;
CREATE TABLE book_chapters(
    book_id integer references books NOT NULL,
    chapter_num integer,
    book_pdf_path VARCHAR(255) NOT NULL,
    PRIMARY KEY(book_id,book_pdf_path)
);

/*	
DROP TABLE IF EXISTS book_images;
CREATE TABLE book_images(
    book_img_path VARCHAR(255) NOT NULL,
	book_id integer references books NOT NULL,
    PRIMARY KEY(book_id,book_img_path)
);
*/
DROP TABLE IF EXISTS book_comments;
CREATE TABLE book_comments(
	book_id integer references books NOT NULL,
	comment_id integer references comments NOT NULL,
	PRIMARY KEY(book_id,comment_id)
);

DROP TABLE IF EXISTS likes_unlikes;
DROP TABLE IF EXISTS likes;

CREATE TABLE likes(
        user_id integer references users NOT NULL,
        book_id integer references books NOT NULL,
        PRIMARY KEY(book_id,user_id)
); 

DROP TABLE IF EXISTS pins;
CREATE TABLE pins(
        user_id integer references users NOT NULL,
        book_id integer references books NOT NULL,
        PRIMARY KEY(book_id,user_id)
); 


DROP TABLE IF EXISTS collections;
CREATE TABLE collections(
    	collection_id serial ,
        title VARCHAR(255) NOT NULL, 
        description VARCHAR(255),
        user_id integer references users NOT NULL, /*refernce the creater*/
        PRIMARY KEY(collection_id),
        unique(title,user_id)
);      

DROP TABLE IF EXISTS user_collections;
CREATE TABLE user_collections(
    	collection_id integer references collections NOT NULL ,
        user_id integer references users NOT NULL,
        PRIMARY KEY(user_id,collection_id)
);   


CREATE TABLE books_in_collection(
        collection_id integer references collections NOT NULL,
        book_id integer references books NOT NULL,
        PRIMARY KEY (collection_id,book_id)
);


DROP TABLE IF EXISTS carts;
CREATE TABLE carts(
        user_id integer references users NOT NULL,
        book_id integer references books NOT NULL,
	primary key (user_id,book_id)
);
                             
DROP TABLE IF EXISTS user_orders;
CREATE TABLE user_orders(
        user_id integer references users NOT NULL,
        order_id serial PRIMARY KEY,
        money_paid numeric NOT NULL,
	order_time timestamp NOT NULL
);


DROP TABLE IF EXISTS orders;
CREATE TABLE orders(
        order_id integer references user_orders,
        book_id integer references books NOT NULL,
	book_order_id serial PRIMARY KEY,
        rating numeric DEFAULT 0
);

DROP TABLE IF EXISTS wishlists;
CREATE TABLE wishlists(
        user_id integer references users NOT NULL,
        book_id integer references books NOT NULL,
        primary key (user_id,book_id)
);

insert into books (book_name, price, author, img_url) values ('One Piece Vol. 1', 100, 'Eiichiro Oda', 'https://i.imgur.com/jUoo5OY.jpg');
insert into books (book_name, price, author, img_url) values ('One Piece Vol. 2', 100, 'Eiichiro Oda', 'https://i.imgur.com/kiRNkQJ.jpg');
insert into books (book_name, price, author, img_url) values ('Spy X Family Vol. 1', 100, 'Tatsuya Endo', 'https://i.imgur.com/EISu6cm.jpg');
insert into books (book_name, price, author, img_url) values ('Spy X Family Vol. 2', 100, 'Tatsuya Endo', 'https://i.imgur.com/hzsJwzy.jpg');
insert into books (book_name, price, author, img_url) values ('Spy X Family Vol. 3', 100, 'Tatsuya Endo', 'https://i.imgur.com/uewRRQk.jpg');
insert into books (book_name, price, author, img_url) values ('Spy X Family Vol. 4', 100, 'Tatsuya Endo', 'https://i.imgur.com/XEOwDPy.jpg');
insert into books (book_name, price, author, img_url) values ('Spy X Family Vol. 5', 100, 'Tatsuya Endo', 'https://i.imgur.com/v01TxCi.jpg');
insert into books (book_name, price, author, img_url) values ('Spy X Family Vol. 6', 100, 'Tatsuya Endo', 'https://i.imgur.com/1AwRZpS.jpg');
insert into books (book_name, price, author, img_url) values ('Spy X Family Vol. 7', 100, 'Tatsuya Endo', 'https://i.imgur.com/3fvOzeA.jpg');

insert into book_chapters (book_id, chapter_num, book_pdf_path) values (1, 1, 'http://localhost:3000/onepiece1.pdf');
insert into book_chapters (book_id, chapter_num, book_pdf_path) values (1, 2, 'http://localhost:3000/onepiece2.pdf');
insert into book_chapters (book_id, chapter_num, book_pdf_path) values (1, 3, 'http://localhost:3000/onepiece3.pdf');
insert into book_chapters (book_id, chapter_num, book_pdf_path) values (2, 4, 'http://localhost:3000/onepiece4.pdf');
insert into book_chapters (book_id, chapter_num, book_pdf_path) values (2, 5, 'http://localhost:3000/onepiece5.pdf');
insert into book_chapters (book_id, chapter_num, book_pdf_path) values (2, 6, 'http://localhost:3000/onepiece6.pdf');
insert into book_chapters (book_id, chapter_num, book_pdf_path) values (2, 7, 'http://localhost:3000/onepiece7.pdf');
insert into book_chapters (book_id, chapter_num, book_pdf_path) values (2, 8, 'http://localhost:3000/onepiece8.pdf');

insert into books (book_name, price, author, img_url) values ('The Fault in Our Stars', 100, 'John Green', 'https://i.imgur.com/3fvOzeA.jpg');
insert into books (book_name, price, author, img_url) values ('Of Mice and Men', 100, 'John Steinbeck', 'https://i.imgur.com/3fvOzeA.jpg');
insert into books (book_name, price, author, img_url) values ('Fifty Shades of Grey', 100, 'E.L. James', 'https://i.imgur.com/3fvOzeA.jpg');
insert into books (book_name, price, author, img_url) values ('The Girl on the Train', 100, 'Paula Hawkins', 'https://i.imgur.com/3fvOzeA.jpg');
insert into books (book_name, price, author, img_url) values ('Life of Pi', 100, 'Yann Martel', 'https://i.imgur.com/3fvOzeA.jpg');
