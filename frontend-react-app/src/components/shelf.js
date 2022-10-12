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
import { apiCall } from './helper';

import styles from "./shelves.module.css";

//import { apiCall } from './helper';
import { useCookies } from 'react-cookie';

import { getShelves, getShelfBooks, removeBookFromShelf, deleteShelfApi } from './shelf-api';

import { useParams, Link, URLSearchParams } from 'react-router-dom';
import Bookcard from './book-card.js';

import EditShelfDialog from './shelf-edit-dialog';
 
function getShelfInfos(collId, setError){
    return apiCall("collection/get_collection_details", "POST",{
        collection_id: collId
    }, setError);
}

function Shelf() {
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
 
    const [shelfBooks, setShelfBooks] = useState(null);

    const [shelfInfo, setShelfInfo] = useState(null);

    //const query = useQuery();
    //const collId = query.get('id');
    const { collId } = useParams();
    console.log(collId);
   
    
    useEffect(() => {
        getShelfInfos(collId, alert).then(body => { //TODO - change userId to auth token
            console.log(body.result);
            setShelfInfo(body.result);
            // console.log(book);
        });
    }, []);

    

    useEffect(() => {
        getShelfBooks(collId, alert).then(body => {
            console.log(body.result);
            setShelfBooks(body.result);
            // console.log(book);
        });
    }, []);

    const [editShelfOpen, setEditShelfOpen] = useState(false);
    const handleEditShelfDialogOpen = () => {
        setEditShelfOpen(true);
    }

    const removeBook = (bookId, collId, setError) => {
        setShelfBooks(shelfBooks.filter(book => book.book_id !== bookId)) // make sure bookId passed in are integers
        removeBookFromShelf(bookId, collId, cookies.session, setError)
    }

    const deleteShelf = (authToken, collectionId, setError) => {
        console.log("deleting shelf");
        deleteShelfApi(authToken, collectionId, setError ); //TODO: change user id to authtoken
        setTimeout(() => { window.location='/shelves'},200);
    }
    const chosen = parseInt(collId, 10);
    //console.log(shelfBooks);

return (
	
	<div className="App">
    {shelfInfo && shelfInfo
                      .map((shelf) => (
                      <div>
                      <ShelfComponent
                                collectionId={collId}
                                collectionTitle={shelf.title}
                                collectionDescription={shelf.description}
                                deleteShelf={() => deleteShelf(cookies.session, collId, alert)} // TODO: change user id here
                                needViewShelf="false"
                                needFollowBtn="true"
                            />
                      </div>
                      ))}
 
	</div>
  );
}


export default Shelf;