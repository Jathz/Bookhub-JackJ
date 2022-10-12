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

function Home() {
	return (
	<div className="App">
	<font face="Arial">
  <div align="center">
    <BookCard />
  </div>
	<div align="left">
	
		<b>Best Sellers</b>
  </div>
  <div align="center">
    <Stack direction="row" spacing={2}>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
    </Stack>
  </div>
	

  	<div align="left">
		<b>New releases</b>
  	<Stack direction="row" spacing={2}>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
      </Stack>
  	</div>

  	<div align="left">
		<b>Popular shelves</b>
  	<Stack direction="row" spacing={2}>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
        <Item><BookCard /></Item>
      </Stack>
  	</div>


  	<div align="left">
		<b>Popular on the internet</b>
  	<BookCard />
  	</div>

  	</font>
  	</div>

  );
}

export default Home;