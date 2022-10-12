import * as React from 'react';
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

import BookCard from './book-card.js';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Admin() {
	return (
	<div className="App">
	<font face="Arial">
  <div align="center">
   <br/>
   <p><b> Admin Home </b></p>
   <br/>
   <Button variant="contained" href='add-product'>Add Product</Button>
    <br/>
    <br/>
   <Button variant="contained" href='view-sales'>View Sales</Button>
    <br/>
    <br/>
   {/* <Button variant="contained">Run Sentiment Analysis </Button> */}
   <br/>
   <br/>
  </div>
  </font>
  </div>

  );
}

export default Admin;