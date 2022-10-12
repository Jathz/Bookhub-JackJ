import React, { useEffect, useState, useLocation } from 'react';
import styles from "./home.module.css";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

import BookCard from './book-card.js';
import Adminbook from './admin-book-card.js'
import { apiCall } from './helper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function getAdminBooks(setError) {
    return apiCall(`book/all`, "GET", null, setError);
}

function ViewSales() {
  const [adminBooks, setAdminBooks] = useState(null);

  useEffect(() => {
        getAdminBooks(alert).then(body => {
            console.log(body.result);
            setAdminBooks(body.result);
            //console.log(body.result);
        });
    }, []);

	return (
	<div className="App">
  	<font face="Arial">
    <div align="center">
      <br/>
      <p><b> Products Sold</b></p>
      <br/>
      <CssBaseline />
      <Container fixed>
        {adminBooks && adminBooks.map((book) => (
                    <div>
                    <Adminbook
                        margin="10px"
                        bookName={book.book_name}
                        author={book.author}
                        publisher={book.publisher}
                        price={book.price}
                        image={book.img_url}
                        bookId={book.book_id}
                        likes={book.like_number}
                        views={book.view_number}
                        sales={book.number_sold}
                    ></Adminbook><br/>
                    </div>
                ))}
        
      </Container>
    	<br/>
    </div>
    </font>
  </div>

  );
}

export default ViewSales;