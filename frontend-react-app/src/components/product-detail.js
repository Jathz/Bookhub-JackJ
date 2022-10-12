import React, { useEffect, useState, useLocation } from 'react';
import styles from "./product-detail.module.css";

import { useCookies } from 'react-cookie';
import { Box, Grid, Button, IconButton, Rating, Typography, Paper } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useParams, Link } from 'react-router-dom';
import { apiCall } from './helper';
import { addToCart } from './cart-api.js';


import LikeBtn from './like-btn';
import ShelfAddBtn from './shelf-add-btn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { checkIsAdmin } from './account-api';
import ProductEditDialog from './product-edit-dialog';
import { bookRemoveApi, getBookDetails, getBookRating } from './product-api';

import Slider from "react-slick";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

// no dislike button rn

function addCart(authToken, bookId){
    addToCart(authToken, bookId, alert);
}

function addWishlist(authToken,bookId){
    //console.log(typeof(authToken));
    return apiCall("book/add_to_wishlist", "POST", {
        token: authToken,
        book_id: bookId 
    }, alert);
}

// WIP
function getRecs(bookId, setError) {
    return apiCall(`recommend_based_on_book?book_id=${bookId}&number=10`, "GET", null, setError);
}

function ProductDetail() {
    const [ cookies, setCookie ] = useCookies();
    //console.log(cookies.session);

    const [ getBooks, setBooks] = useState([]);
    const [isHovered, setHovered] = useState(false);

    const isLoggedIn = cookies.session ? true : false;
    //console.log(isLoggedIn);
    const [ error, setError ] = useState(null);
    const [ isAdmin, setIsAdmin ] = useState(false);
    const [bookInfo, setBookInfo] = useState(null);
    const [genres, setGenres] = useState(null);
    // TODO: need to add use state  hooks for each item to retrive
    const { bookId } = useParams();

    const [ ratingValue, setRatingValue] = useState(null);
    //const { newRating } = 0 
    //const ratingValue = 4.5; // setting rating value as rating is not implemented
    
    //console.log(ratingValue);

    // code for handling product edit dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const handleEditDialogOpen = () => {
        setEditDialogOpen(true);
    }
    // end code

    // slider code
    const NextArrow = ({onClick}) => {
        return (
            <div className={styles.sliderNext} onClick={onClick}>
            <ArrowForwardIosIcon />
            </div>
        )
    }

    const PrevArrow = ({onClick}) => {
        return (
            <div className={styles.sliderPrev} onClick={onClick}>
            <ArrowBackIosIcon />
            </div>
        )
    }
    const settings = {
        infinite: false,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    }

    const handleDeleteOnclick = (authToken, bookId, setError) => {
        bookRemoveApi(authToken, bookId, setError).then( body => {//TODO: change userId to token
            if (body.result === "false") {
                setError("Request could not be completed");
                console.log(error);
            } else {
                setError(false);
                alert("Book deleted. Redirecting to home page.");
                window.location='/';
            }
        });
    }

    useEffect(() => {

    getBookRating(bookId).then(body =>{
        //console.log(body.result);
        setRatingValue(body.result);
    });
    //newRating = ratingValue.avg;
    //console.log(newRating);

    getBookDetails(bookId, setError).then(body => {
        // console.log(body.result);
        setBookInfo(body.result);
    });

    if (cookies.session) {
        checkIsAdmin(cookies.session, setError).then(body => {
            // console.log(typeof(body.is_admin));
            setIsAdmin(body.is_admin); // ensure body.is_admin is a boolean
        })
    }

    getRecs(bookId, setError).then(body => {
        console.log("test");
        console.log(body.result["result"]);
        setBooks(body.result["result"]);
    })

    }, []); // needed to include dependency array otherwise would cause infinity loop


    if (error) { // show error message on screen and don't show book
        return (<p>{error}</p>);
    } else if (bookInfo === null) {
        return (<p>Failed to set book info</p>);
    }

    return (
        <div className={styles.body}>
            {isAdmin &&
            <div className={styles.rightAlign}>
                {console.log(isAdmin)}
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={<EditIcon />}
                    onClick={handleEditDialogOpen}
                >Edit</Button>
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteOnclick(cookies.session, bookId, setError)}
                >Delete</Button>
            </div>
            }
            <div className={styles.topContainer}>
                <div className={`${styles.leftSection} ${styles.flexGapWrapper}`}>
                <h1>{bookInfo.book.book_name}</h1>
                    <img className={styles.bookCover} src={bookInfo.book.img_url || require("../assets/Book1.jpg")} alt="Book cover" /> {/*TODO connect this to database*/}
                    <div className={styles.iconBar}>
                        {/* Not implementing wishlist rn */}
 
                        {isLoggedIn && 
                            <div className={styles.iconWrapper}>
                                <LikeBtn bookId={bookId}/>
                            </div>
                        }
                        {isLoggedIn && 
                            <div className={styles.iconWrapper}>
                                <ShelfAddBtn bookId={bookId}/>
                            </div>
                        }

                        <div className={styles.iconWrapper}>
                            <Typography component="legend">Rating</Typography>
                            <div className={styles.ratingWrapper}>
                                {console.log(ratingValue.avg)}
                                <Rating name="rating" value={ratingValue.avg && ratingValue.avg} defaultValue={0.0} precision={0.5} readOnly />
                                <div className={styles.ratingLabel}>{ratingValue.avg !== "null" ? ratingValue.avg : "No ratings"}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.middleSection} ${styles.flexGapWrapper}`}>
                    <table className={styles.bookInfo}>
                        <tbody>
                        {bookInfo.book.author &&
                            <tr>
                                <td>Author(s): </td>
                                <td>{bookInfo.book.author}</td>
                            </tr>
                        }
                        {bookInfo.genres.length > 0 &&
                            <tr>
                                <td>Genre(s): </td>
                                <td>{bookInfo.genres.map((genre, index) => (
                                    <span>{ (index ? ', ': '') + genre}</span>
                                ))}</td>
                            </tr>
                        }
                        
                        {bookInfo.book.publisher &&
                            <tr>
                                <td>Publisher: </td>
                                <td>{bookInfo.book.publisher}</td>
                            </tr>
                        }
                        
                        {bookInfo.book.publish_date &&
                            <tr>
                                <td>Publish date: </td>
                                <td>{bookInfo.book.publish_date}</td>
                            </tr>
                        }
                        
                        {bookInfo.book.number_of_pages &&
                            <tr>
                                <td>Number of pages: </td>
                                <td>{bookInfo.book.number_of_pages}</td>
                            </tr>
                        }
                        
                        {bookInfo.book.language_written &&
                            <tr>
                                <td>Language: </td>
                                <td>{bookInfo.book.language_written}</td>
                            </tr>
                        }
                        
                        {bookInfo.book.isbn &&
                            <tr>
                                <td>ISBN: </td>
                                <td>{bookInfo.book.isbn}</td>
                            </tr>
                        }
                        
                        {bookInfo.book.age_restriction &&
                            <tr>
                                <td>Language: </td>
                                <td>{bookInfo.book.age_restriction}</td>
                            </tr>
                        }
                        
                        {bookInfo.book.description &&
                            <tr>
                                <td>Description: </td>
                                <td>{bookInfo.book.description}</td>
                            </tr>
                        }
                        
                        </tbody>
                    </table>
                </div>
                <div className={`${styles.priceSection} ${styles.flexGapWrapper}`}>
                    <Typography variant="h4" component="h1" sx={{marginBottom: "15px"}}>${parseFloat(bookInfo.book.price).toFixed(2)}</Typography>
                    
                    <Button fullWidth variant="contained" size="large" aria-label="buy now button"
                    onClick={() => {
                        addWishlist(cookies.session, bookId);
                        window.confirm("This book has been added to your wishlist.");
                    }}
                    >
                        Add to wishlist
                    </Button>
                    <Button fullWidth variant="contained" size="large" aria-label="add to cart button"
                    onClick={() => {
                        addCart(cookies.session, bookId);
                        window.confirm("This book has been added to your cart.");
                    }}
                    >
                        Add to cart
                        <ShoppingCartOutlinedIcon sx={{marginLeft: "7px"}} />
                    </Button>
                </div>
            </div>
            <div className={styles.bottomContainer}>
                <span><h3>Similar Books You Might Like</h3></span>
                <div className={styles.bookWrapper}>
                    <Slider {...settings}>
                        {getBooks && getBooks.map((books, idx) => (
                        <div 
                        className={styles.bookSlides} 
                        onMouseEnter={() => setHovered(true)} 
                        onMouseLeave={() => setHovered(false)}
                        >
                            <a href={"/product-detail/" + books["book_id"]}><img src={books["img_url"]} /></a>
                            {isHovered && (
                            <>
                            </>
                            )}
                            <span className={styles.bookTitle}>{books["book_name"]}</span>
                        </div>
                        ))}
                    </Slider>
                </div>
            </div>
            <ProductEditDialog
                open={editDialogOpen}
                setOpen={setEditDialogOpen}
                bookInfo={bookInfo}
                // setCollectionTitle={setCollectionTitle}
                // setCollectionDescription={setCollectionDescription}
            />
        </div>
    );
}


export default ProductDetail;