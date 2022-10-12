import React, { useEffect, useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import { IconButton, Typography, Menu, MenuItem, InputBase, Popper, List, MenuList, ClickAwayListener, Grow, Stack, Paper, Button } from '@mui/material';
import { searchApi } from './search-api';

const ITEM_HEIGHT = 48; // height for each menu item when selecting a shelf

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
}));

function SearchBtn() {
    const [ searchResult, setSearchResult ] = useState(null);
    // code for the menu to select a shelf
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        if (anchorEl && anchorEl.contains(event.target)) {
            return;
        }
      
        setAnchorEl(null);
    };
    // end code

    const handleOnChange = (e) => {
        // get current search query
        const value = e.target.value;
        console.log(value);

        // open result suggestion menu
        searchApi(value, alert).then( body => {
            console.log(body.result);
            setSearchResult(body.result);
        })

        // close menu if no search query
        if (value === "") {
            if (open) {
                handleClose(e);
            }
        }
        else {
            handleOpen(e);
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          window.location=`/search-result/${event.target.value}`;
        }
      }

    const renderSuggestionItems = (result) => {

        const renderResult = [];
        if (result && result.result_books && result.result_books.length > 0) {
            result.result_books.slice(0,7).map(book =>
                renderResult.push({"type": "book", "name": book[1], "id": book[0]})
            );
        }
        if (result && result.result_author && result.result_author.length > 0) {
            result.result_author.slice(0,4).map(author => {
                renderResult.pop();
                renderResult.push({"type": "book", "name": author[10], "id": author[0]});
            })
        }
        if (result && result.result_collection && result.result_collection.length > 0) {
            result.result_collection.slice(0,4).map(collection => {
                renderResult.pop();
                renderResult.push({"type": "collection", "name": collection[1], "id": collection[0]})
            })
        }

        // no results
        if (result
            && result.result_books.length === 0
            && result.result_author.length === 0
            && result.result_collection.length === 0
        ) {
            return <MenuItem key="no-result" disabled>No results</MenuItem>
        }

        // render final result
        return (
            <div>
                {renderResult.map(result => (
                    <MenuItem
                        key={result.type + result.id}
                        onClick={() => {
                            window.location = result.type === "book" ? `/product-detail/${result.id}` : `/shelf/${result.id}`;
                        }}
                    >{result.name}</MenuItem>
                ))}
            </div>
        )
    }
    
    return (
        <div>
            <Search>
                <SearchIconWrapper>
                <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{
                        'aria-label': 'search',
                        'aria-controls': `${open ? 'search-suggestion-menu' : undefined}`,
                        'aria-expanded': `${open ? 'true' : undefined}`,
                        'aria-haspopup': "true",
                    }}
                    // onMouseDown={handleOnChange}
                    onChange={handleOnChange}
                    onKeyPress={handleKeyPress}
                    id="search-field"
                    role="menu"
                    autoComplete="off"
                    sx={{zIndex: "2000"}}
                />
            </Search>
            <Stack direction="row" spacing={2}>
      <div>
        <Popper
          open={open}
          anchorEl={anchorEl}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start',
              }}
            >
                <Paper sx={{zIndex: 10}}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    id="search-suggestion-menu"
                    aria-labelledby="search-field"
                  >
                    {renderSuggestionItems(searchResult)}
                    {/* {searchResult && searchResult.result_books.length === 0
                        && searchResult.result_author.length === 0 
                        && searchResult.result_collection.length===0
                        && console.log("here")
                    &&
                        // no results
                        <MenuItem key="no-result" disabled>No results{console.log("hrere")}</MenuItem>
                    } */}

                  </MenuList>
                </ClickAwayListener>
                </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
        </div>
    )
}

export default SearchBtn;