import React, { useEffect, useState } from 'react';
import styles from "./shelves.module.css";

import { Button, Paper, Link as MuiLink, Menu, MenuItem } from '@mui/material';
import Bookcard from './book-card';
import { useCookies } from 'react-cookie';
import { checkIsOwnerApi, followCollectionApi, getShelfBooks, removeBookFromShelf } from './shelf-api';
import { Link } from 'react-router-dom';
import EditShelfDialog from './shelf-edit-dialog';
import { Typography } from '@material-ui/core';

// TODO: update the props
// props.collectionId
// props.collectionTitle
// props.collectionDescription
// props.deleteShelf {function} - function to call to delete this shelf
// props.needViewShelf - string bool - whether need view shelf link
// props.needFollowBtn - string bool
function ShelfComponent(props) {
    const [ collectionTitle, setCollectionTitle ] = useState(props.collectionTitle);
    const [ collectionDescription, setCollectionDescription] = useState(props.collectionDescription);
    const [ isOwner, setIsOwner ] = useState(false);

    const [ cookies, setCookie ] = useCookies();
    // console.log(cookies.session);

    // code for handling options menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // code for handling follow button
    const handleFollowBtnClick = () => {
        followCollectionApi(cookies.session, props.collectionId).then( body => {
            if (body.result && body.result === "true") {
                alert("You have followed this shelf.");
            }
        })
    }

    // code for handling edit shelf dialog
    const [editShelfOpen, setEditShelfOpen] = useState(false);
    const handleEditShelfDialogOpen = () => {
        setEditShelfOpen(true);
    }

    const [shelfBooks, setShelfBooks] = useState(null);
    // const [paperElevation, setElevation] = useState(1);

    useEffect(() => {
        getShelfBooks(props.collectionId, alert).then(body => {
            // console.log(body.result);
            setShelfBooks(body.result);
            // console.log(shelfBooks);
        });

        checkIsOwnerApi(cookies.session, props.collectionId, alert).then(body => {
            console.log(body.result);
            setIsOwner(body.result);
        })
    }, []); // needed to include dependency array otherwise would cause infinity loop

    // remove a book from shelf (removes from frontend & calls backend api)
    // need to pass this to book-card.js component to call in its "remove" button
    const removeBook = (bookId, collectionId, setError) => {
        setShelfBooks(shelfBooks.filter(book => book.book_id !== bookId)) // make sure bookId passed in are integers
        removeBookFromShelf(bookId, collectionId, cookies.session, setError)
    }
    // console.log(shelfBooks);
 
    return (
        <Paper
            className={styles.shelfComponent}
            // elevation={paperElevation}
            // onMouseEnter={() => {setElevation(10)}}
            // onMouseLeave={() => {setElevation(1)}}
        >
            <div className={styles.shelfComponentTopContainer}>
                <div className={`${styles.shelfComponentLeft} ${styles.shelfGapWrapper}`}>
                        <h3 style={{marginTop: "0px"}}>{collectionTitle || "No shelf title"}</h3>
                        <Typography variant="body2" className={styles.shelfDescription}>{collectionDescription || "No shelf description"}</Typography>
                    </div>
                    <div style={{flex: "0.3"}}></div>
                    {(!props.needViewShelf || props.needViewShelf === "true") &&
                    <div className={styles.shelfComponentRight}>
                        <Link to={"/shelf/"+props.collectionId}>
                            <div style={{height: "2px"}} />
                            <MuiLink variant="body2" sx={{marginRight: "10px"}}>
                                VIEW SHELF
                            </MuiLink>
                        </Link>
                    </div>
                    }
                    {props.needFollowBtn === "true" && !isOwner &&
                        <div className={`${styles.shelfComponentRight} ${styles.shelfGapWrapper}`}>
                        {/* <Button variant="outlined" startIcon={<AddIcon />} size="small">Add a book</Button> */}
                        <div style={{width: "5px"}} />
                        <Button
                            onClick={handleFollowBtnClick}
                        >Follow</Button>
                        </div>
                    }
                    {isOwner &&
                    <div className={`${styles.shelfComponentRight} ${styles.shelfGapWrapper}`}>
                        {/* <Button variant="outlined" startIcon={<AddIcon />} size="small">Add a book</Button> */}
                        <div style={{width: "5px"}} />
                        <Button
                            variant="outlined"
                            size="small"
                            id="options-button"
                            aria-controls={open ? 'options-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleMenuClick}
                        >Options</Button>
                        <Menu
                            id="options-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            MenuListProps={{
                            'aria-labelledby': 'options-button',
                            }}
                        >
                            <MenuItem onClick={() => {
                                handleMenuClose();
                                handleEditShelfDialogOpen();
                            }}>Edit shelf</MenuItem>
                            <MenuItem onClick={() => {
                                handleMenuClose();
                                if (window.confirm("Are you sure you want to delete this shelf?")) {
                                    props.deleteShelf();
                                    alert("Shelf deleted");
                                }
                            }}>Delete Shelf</MenuItem>
                        </Menu>
                    </div>
                    }
                    <EditShelfDialog
                        open={editShelfOpen}
                        setOpen={setEditShelfOpen}
                        title={collectionTitle}
                        description={collectionDescription}
                        collectionId={props.collectionId}
                        setCollectionTitle={setCollectionTitle}
                        setCollectionDescription={setCollectionDescription}
                    />
            </div>
            <div className={styles.shelfBooksSection}>
                {shelfBooks && shelfBooks.map((book) => (
                    <Bookcard
                        margin="10px"
                        needRemoveBtn="true"
                        bookName={book.book_name}
                        author={book.author}
                        image={book.img_url}
                        bookId={book.book_id}
                        collectionId={props.collectionId}
                        removeBook={() => removeBook(book.book_id, props.collectionId, alert)}
                    ></Bookcard>
                ))}

            </div>
        </Paper>
    );
}

export default ShelfComponent;