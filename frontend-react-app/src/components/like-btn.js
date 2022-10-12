import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { apiCall } from './helper';

// props.bookId - bookId of the book to like/unlike
function likeUnlikeBook(bookId, isLike, authToken, setHasLiked) {
    let result = apiCall("book/like", "POST", {
        book_id: bookId,
        token: authToken,
        likes: String(isLike),
    }, null, alert);

    if (result) {
        setHasLiked(isLike);
    }
}
 
function checkLike(bookId, authToken) {

    let userId = 1; //TODO: change this

    return apiCall("book/check_like", "POST", {
        token: authToken,
        book_id: bookId
    }, null, alert);
}

function LikeBtn(props) {
    const [ cookies, setCookie ] = useCookies();
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        checkLike(props.bookId, cookies.session).then(body => {
            // console.log(body.result);
            setHasLiked(body.result.like);
        })
    
        }, []); // needed to include dependency array otherwise would cause infinity loop

    return (
        <div>
            <Typography component="legend">Like</Typography>
            { hasLiked ?
                <IconButton aria-label="like this book (selected)" onClick={() => likeUnlikeBook(props.bookId, false, cookies.session, setHasLiked)}>
                    <FavoriteIcon name="like" />
                </IconButton>
                :
                <IconButton aria-label="like this book (unselected)" onClick={() => {likeUnlikeBook(props.bookId, true, cookies.session, setHasLiked)}}>
                    <FavoriteBorderIcon name="like" />
                </IconButton>
            }
        </div>
    )
}

export default LikeBtn;