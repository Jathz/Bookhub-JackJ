import React, { useEffect, useState, useLocation } from 'react';
import styles from "./home.module.css";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Box, Tabs, Tab, Button, Divider, Paper, Typography } from '@mui/material';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import { apiCall } from './helper';
import BrowseBookcard from'./browse-book-card.js';
import Grid from '@mui/material/Grid'


function getBooks(genreId, setError) {
    return apiCall(`book/by_genre?genre_id=${genreId}`, "GET", null, setError);
}

function BrowseComponent(props){

	const [books, setBooks]  = useState(null);

	useEffect(() => {
        getBooks( props.genreId,alert).then(body => {
            console.log(body.result);
            setBooks(body.result);
            //console.log(body.result);
        });
    }, []);

    return(

    	<Grid
            container
            spacing={2.5}
            style={{
              maxHeight: "1000vh",
              overflowY: "auto",
              overflowX: "hidden",
              height: "662px",
              overflow: "auto",
            }}
          >
    	 {books && books.map((book) => (
    	 	<Grid item>
    	 	<BrowseBookcard
                        needRemoveBtn="true"
                        bookName={book.book_name}
                        author={book.author}
                        image={book.img_url}
                        bookId={book.book_id}

                        
                    ></BrowseBookcard>
            </Grid>
    	 ))}
    	</Grid>
    	)
}

export default BrowseComponent;