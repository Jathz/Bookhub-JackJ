import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { IconButton, Typography, Menu, MenuItem } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { addBookToShelfApi, getShelves } from './shelf-api';

const ITEM_HEIGHT = 48; // height for each menu item when selecting a shelf

// props.bookId - bookId of the book to add to a shelf
function ShelfAddBtn(props) {
    const [ cookies, setCookie ] = useCookies();
    const [myShelvesList, setMyShelvesList] = useState(null);
    const [ error, setError ] = useState(false);

    // code for the menu to select a shelf
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
    // end code

    const handleShelfClick = (collectionId) => {
        addBookToShelfApi(cookies.session, props.bookId, collectionId, alert).then( body => {
            // console.log(body);
            if (body.result === "false") {
                alert("Book is already in the shelf");
                // console.log("book in shelf");
            } else {
                alert("Book is added to shelf");
            }
        });
    }

    useEffect(() => {
        getShelves(cookies.session, alert).then(body => { //TODO: change this to auth token
            // console.log(body.result.my_collection);
            setMyShelvesList(body.result.my_collection);
        });
    
    }, []); // needed to include dependency array otherwise would cause infinity loop
    
    return (
        <div>
            <Typography component="legend">Add to shelf</Typography>
            <IconButton
                aria-label="add this book to a shelf"
                id="shelf-button"
                aria-controls={open ? 'shelf-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleMenuOpen}
            >
                <AddBoxIcon name="addShelf"/>
            </IconButton>

            <Menu
                id="shelf-menu"
                MenuListProps={{
                'aria-labelledby': 'shelf-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                },
                }}
            >
                <MenuItem key="menu-title" disabled={true}>
                    Select a shelf
                </MenuItem>
                {myShelvesList && myShelvesList.map((shelfOption) => (
                    <MenuItem
                        key={shelfOption.title}
                        onClick={() => {handleShelfClick(shelfOption.collection_id);handleMenuClose()}}
                    >
                        {shelfOption.title}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

export default ShelfAddBtn;