import { MenuItem, MenuList, Paper, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { searchApi } from './search-api';
import SearchResultComponent from './search-results-component';
import styles from "./search-results.module.css";

function SearchResult() {
    const query = useParams(); // returns an object like {query: 'spy'}
    // console.log(query);
    const [ searchResult, setSearchResult ] = useState(null);
    const [ bookResult, setBookResult ] = useState(null);
    const [ authorResult, setAuthorResult ] = useState(null);
    const [ collectionResult, setCollectionResult ] = useState(null);
    const bookRef = useRef(null);
    const scrollToBook = () => bookRef.current.scrollIntoView();
    const authorRef = useRef(null);
    const scrollToAuthor = () => authorRef.current.scrollIntoView();
    const shelfRef = useRef(null);
    const scrollToShelf = () => shelfRef.current.scrollIntoView();

    useEffect(() => {
        searchApi(query.query, alert).then( body => {
            console.log(body.result);
            setSearchResult(body.result);
        })
    }, []); // needed to include dependency array otherwise would cause infinity loop


    return (
        <div className={styles.container}>
            <h1>Search Results</h1>
            <div className={styles.mainContainer}>
                <div className={styles.left}>
                    <div className={styles.menu}>
                    <Paper>
                    <MenuList sx={{padding: "10px"}}>
                        <MenuItem
                            className={styles.menuItem}
                            onClick={scrollToBook}
                        >By Book Name</MenuItem>
                        <MenuItem
                            className={styles.menuItem}
                            onClick={scrollToAuthor}
                        >By Author</MenuItem>
                        <MenuItem
                            className={styles.menuItem}
                            onClick={scrollToShelf}
                        >Shelves</MenuItem>
                    </MenuList>
                    </Paper>
                    </div>
                </div>
                <div className={styles.resultContainer}>
                        <div ref={bookRef}>
                            <SearchResultComponent
                                title="By Book Name"
                                results={searchResult && searchResult.result_books}
                            />
                        </div>
                        <div ref={authorRef}>
                            <SearchResultComponent
                                title="By Author"
                                results={searchResult && searchResult.result_author}
                            />
                        </div>
                        <div ref={shelfRef}>
                            <SearchResultComponent
                                variant="shelf"
                                title="By Shelves"
                                results={searchResult && searchResult.result_collection}
                            />
                        </div>
                </div>
            </div>

        </div>
    )
}

export default SearchResult;