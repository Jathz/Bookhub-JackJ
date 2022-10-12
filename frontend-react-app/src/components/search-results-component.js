import React, { useEffect, useState } from 'react';
import styles from "./shelves.module.css";

import { Button, Paper, Link as MuiLink, Menu, MenuItem } from '@mui/material';
import Bookcard from './book-card';
import { useCookies } from 'react-cookie';
import { getShelfBooks, removeBookFromShelf } from './shelf-api';
import { Link } from 'react-router-dom';
import EditShelfDialog from './shelf-edit-dialog';
import { Typography } from '@material-ui/core';
import Shelfcard from './shelf-card';

// TODO: update the props
// props.title - title for the component
// props.results - list of books
// props.variant - either "book" or "shelf"
function SearchResultComponent(props) {
    // const [books, setBooks] = useState(props.results);
    // const [paperElevation, setElevation] = useState(1);
 
    return (
        <Paper
            className={styles.shelfComponent}
            // elevation={paperElevation}
            // onMouseEnter={() => {setElevation(10)}}
            // onMouseLeave={() => {setElevation(1)}}
        >
            <div className={styles.shelfComponentTopContainer}>
                <div className={`${styles.shelfComponentLeft} ${styles.shelfGapWrapper}`}>
                        <h3 style={{marginTop: "0px"}}>{props.title}</h3>
                    </div>
                    <div style={{flex: "0.3"}}></div>
                    <div className={`${styles.shelfComponentRight} ${styles.shelfGapWrapper}`}>
                        {/* <Button variant="outlined" startIcon={<AddIcon />} size="small">Add a book</Button> */}
                        <div style={{width: "5px"}} />
                    </div>
            </div>
            <div className={styles.shelfBooksSection}>
                {props.results && props.results.length === 0 && <Typography>No results</Typography>}
                {(!props.variant || props.variant === "book") &&
                    props.results && props.results.map((book) => (
                        <Bookcard
                            margin="10px"
                            bookName={book[1]}
                            author={book[10]}
                            image={book[9]}
                            bookId={book[0]}
                            price={book[2]}
                            needPrice="true"
                            // needShelfCartBtns="true"
                        ></Bookcard>
                    ))
                } 
                {props.variant === "shelf" &&
                    props.results && props.results.map((shelf) => (
                        <Shelfcard
                            margin="10px"
                            title={shelf[1]}
                            collectionId={shelf[0]}
                            createdBy={shelf[3]}
                        ></Shelfcard>
                    ))
                }

            </div>
        </Paper>
    );
}

export default SearchResultComponent;