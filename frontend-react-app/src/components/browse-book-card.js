import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { CardActionArea} from '@material-ui/core';
import { Link } from 'react-router-dom';

// props format
// props.image {string} - image url of book cover
// props.bookName {string} - book title
// props.bookId {string (int)} - book id - for adding href
// props.collectionId {string (int)} - collection id for the collection(shelf) the book is in
// props.price {string} - price
// props.needShelfCartBtns {string (bool)} - value "true" or just dont pass in - whether you need the bottom add to shelf and cart buttons
// props.needRemoveBtn {string (bool)} - as above
// props.needPrice {string (bool)}
// props.margin {string} - e.g. 10px
// props.removeBook {function} - function to remove this book from its shelf
function BrowseBookcard(props) {
    // console.log(props.bookId);
	return (
  	<Card sx={{ width: 135, height: 350, margin: props.margin}}>
        <Link to={"/product-detail/"+props.bookId}>
      <CardMedia
        component="img"
        alt="book cover"
        image= {props.image || require("../assets/defaultBookCover.jpg") || "https://i.imgur.com/ZmqBOOa.jpg"}
      />
      <CardContent sx={{paddingBottom: "0px"}}>
        {/* <img
            src={props.image || require("../assets/defaultBookCover.jpg") || "https://i.imgur.com/ZmqBOOa.jpg"}
            style={{width: "100px"}}
        /> */}
        <Typography gutterBottom variant="body" component="div">
          {props.bookName || "Book Title"}
        </Typography>
        <Typography gutterBottom variant="caption" component="div">
          {props.author || "Author"}
        </Typography>
        {props.needPrice &&
          <Typography variant="body2" color="text.secondary">
            $ {props.price || "Price"}
          </Typography>
        }
      </CardContent>
      { props.needShelfCartBtns &&
        <CardActions>
            <Button size="small">+ Shelf</Button>
            <Button size="small">+ Cart</Button>
        </CardActions>
      }
      </Link>
    </Card>

  );
}

export default BrowseBookcard;