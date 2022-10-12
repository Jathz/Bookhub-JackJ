import React, { useEffect, useState, useLocation } from 'react';

import styles from "./shelves.module.css";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';

import { styled } from '@mui/material/styles';
import { Box, Tabs, Tab, Button, Divider, Paper, Typography } from '@mui/material';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid'
import { apiCall } from './helper';
import BrowseComponent from './browse-component'
import BrowseBookcard from './browse-book-card'
function getGenres(setError) {
    return apiCall(`genre`, "GET", null, setError);
}

function getBooks(genreId, setError) {
    return apiCall(`book/all`, "GET", null, setError);
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

function Browse(){
	const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    
	const [genres, setGenres] = useState(null);
	useEffect(() => {
        getGenres( alert).then(body => {
            console.log(body.result);
            setGenres(body.result);
            //console.log(body.result);
        });
    }, []);

    const [books, setBooks] = useState(null);
    useEffect(() => {
        getBooks( alert).then(body => {
            console.log(body.result);
            setBooks(body.result);
            //console.log(body.result);
        });
    }, []);

    
	return(
    <div>
		<div>
            <Tabs className={styles.tabToggleBar} value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label= "All genres"  {...a11yProps(0)}></Tab>
                {genres && genres.map((genre) => (
                    <Tab label={genre.genre_description} {...a11yProps(genre.genre_id +1)}></Tab>
                ))}
            </Tabs>
            <Divider />
        </div>
        <TabPanel value={value} index={0}>
        <br/><br/>
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
         </TabPanel>
        {genres && genres.map((genre) => (
        <TabPanel value={value} index={genre.genre_id}>
            <br/><br/>
               <BrowseComponent
                genreId={genre.genre_id}
                />
        </TabPanel>
        ))}

    </div>
		)
}

export default Browse;
