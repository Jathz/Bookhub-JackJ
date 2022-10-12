import React, { useEffect, useState, useLocation } from 'react';

//import Card from '@mui/material/Card';
//import CardActions from '@mui/material/CardActions';
//import CardContent from '@mui/material/CardContent';
//import CardMedia from '@mui/material/CardMedia';
//import Button from '@mui/material/Button';
//import Typography from '@mui/material/Typography';
//import Paper from '@mui/material/Paper';
//import Stack from '@mui/material/Stack';
//import { styled } from '@mui/material/styles';

//import { useState, useEffect } from 'react';
//import Slider from "react-slick";
//import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
//import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
//import BookOutlinedIcon from '@material-ui/icons/BookOutlined';

//import CssBaseline from '@mui/material/CssBaseline';
//import Box from '@mui/material/Box';
//import Container from '@mui/material/Container';
import { Button, Paper, Link as MuiLink, Menu, MenuItem  } from '@mui/material';
import ShelfComponent from './shelf-component';

import styles from "./shelves.module.css";

//import { apiCall } from './helper';
import { useCookies } from 'react-cookie';
import { apiCall } from './helper';

import { getShelves, getShelfBooks, removeBookFromShelf, deleteShelfApi } from './shelf-api';

import { useParams, Link, URLSearchParams } from 'react-router-dom';
import Bookcard from './book-card.js'

function getBooks(authToken, setError) {
    console.log(typeof(authToken));
    return apiCall("book/get_all_wishlist", "POST", {
        token: authToken
    }, setError); 
}


function Mywishlist() {
    const [ cookies, setCookie ] = useCookies();
    console.log(cookies.session);

    // code for handling options menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const [books, setBooks] = useState(null);

   

    useEffect(() => {
        getBooks(cookies.session, alert).then(body => {
            console.log(body.result);
            setBooks(body.result);
            // console.log(book);
        });
    }, []);


return (
	
	<div className="App">
  <Paper className={styles.shelfComponent}>
            <div className={styles.shelfComponentTopContainer}>
                <div className={`${styles.shelfComponentLeft} ${styles.shelfGapWrapper}`}>
                      <div>
                      
                      <h3 style={{marginTop: "0px"}}>My Wishlist</h3>
                      </div>
                      
                

                </div>
            </div>
            <div className={styles.shelfBooksSection}>
                {books && books.map((book) => (
                    <Bookcard
                        margin="10px"
                        bookName={book.title}
                        author={book.author}
                        image={book.img}
                        bookId={book.id}
                    ></Bookcard>
                ))}

            </div>
        </Paper>
	<br/>
	</div>
  );
}


export default Mywishlist;