import React, { useEffect, useState } from 'react';
import styles from "./home.module.css";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { useCookies } from 'react-cookie';

import { useLocation } from 'react-router';

import Cartbook from './cart-book-card.js';

import { getCartPrice, getCartBookes, removeBookFromCart, buyCart } from './cart-api';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function Checkout() {
    console.log(useLocation().state); // this is the state passed in from product detail page if user clicked "buy now"
    const [cookies] = useCookies();
    const [cartBookes, setCartBookes] = useState(null);

	const [cartPrice, setCartPrice] = useState(null);
	const userId  = 1

	useEffect(() => {
        getCartBookes(cookies.session, alert).then(body => {
            console.log(body.result);
            setCartBookes(body.result);
            //console.log(body.result);
        });
    }, []);

	useEffect(() => {
		getCartPrice(cookies.session,alert).then(body =>{
			console.log(body.result);
			setCartPrice(body.result);

		});
	}, []);

	const removeBook = (authToken, bookId, bookPrice, setError) => {
        setCartBookes(cartBookes.filter(book => book.book_id !== bookId)) // make sure bookId passed in are integers
        setCartPrice(cartPrice.filter(pricee => pricee.price = pricee.price - bookPrice))
        console.log("poopie")
        removeBookFromCart(authToken, bookId, setError)
    }

	return (
	
	<div className="App">
	<font face="Arial">
	<div align="cente">
	<br/>
	<p><b><t></t> Checkout</b></p>
	<br/>
	</div>
	
	      <Container fixed>
	        <div align='center'>
	        	<Stack direction="row" spacing={10}>
        		<Item sx={{ boxShadow: 'none', width : 800 }}>
        			{cartBookes && cartBookes.map((book) => (
                    <div>
                    <Cartbook
                        margin="10px"
                        bookName={book.book_name}
                        author={book.author}
                        publisher={book.publisher}
                        price={book.price}
                        image={book.img_url}
                        bookId={book.book_id}
                        userId={userId}
                        removeBook={() => removeBook(cookies.session, book.book_id, book.price, alert)}
                    ></Cartbook><br/>
                    </div>
                    ))}
        		</Item>
        		<Item sx={{ boxShadow: 'none', width : 300 }}>
        			<div align = 'right'>
        			<table>
        			{cartBookes && cartBookes.map((book) => (
        				<p><tr><td width="3000"><div align='left'>{book.book_name}:</div></td><td><div align='right'> ${book.price}</div></td></tr></p>
        			))}
        			</table>
        			<table>
        			{cartPrice && cartPrice.map((pricee) => (
        				<p><b><tr><td width="3000"><div align='left'>Total Price:</div></td><td><div align='right'> ${pricee.price}</div></td></tr></b></p>
        				))}
        			</table>
        			</div>
        			<br/>
        			<br/>
        			<br/>
        			Card Details:
        			<br/>
        			<br/>
        			<TextField id="outlined-basic" label="Cardholder Name" variant="outlined" />
        			<br/>
        			<br/>
        			<TextField id="outlined-basic" label="Card Number" variant="outlined" />
        			<br/>
        			<br/>
        			<TextField id="outlined-basic" label="Expiry Date" variant="outlined" />
        			<br/>
        			<br/>
        			<TextField id="outlined-basic" label="Security Code" variant="outlined" />
        			<br/>
        			<br/>
        			<Button variant="contained" onClick={() => {
        				if (window.confirm("Are you sure you want to buy these books?")){
        					buyCart(cookies.session);
        					setTimeout(() => {  window.location='/my-books';}, 200);
        				}
        				}}> Pay Now </Button>
        		</Item>
        		</Stack>
        	</div>
	      </Container>
	<br/>
	
  	</font>
  	</div>
  );
}

export default Checkout;