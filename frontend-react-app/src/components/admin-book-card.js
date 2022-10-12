import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import CardHeader from '@mui/material/CardHeader';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { CardActionArea} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { apiCall, handleRemoveItem } from './helper';
import { removeBookFromCart } from './cart-api';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


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
function Adminbook(props) {


  return(
    <Card sx={{ maxWidth: 1000 }}>
          <div>
            <Stack direction="row" spacing={2}>

              <Item sx={{ boxShadow: 'none', width: 180}}>
                <CardMedia
                component="img"
                alt="book cover"
                height="250"
                image={props.image || "https://i.imgur.com/ZmqBOOa.jpg"}/>
              </Item>
              <Item sx={{ boxShadow: 'none', width: 180}}>
                <b>{props.bookName || "Book Title"}</b>
                <br/>{props.author || "author of Book"}
                      testing
                <br/>{props.publisher || "Publisher of Book"}
              </Item>

              <Item sx={{ boxShadow: 'none', width: 500}}>
                <div align="left">
                  Recent Comment:
                  <br/>
                  <br/>
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br/>
                  Ut diam urna, tincidunt ac sodales vel, condimentum eu mauris.<br/>
                  Nunc venenatis ligula elit, ut interdum justo pretium at."<br/>
                </div>
              </Item>

              <Item sx={{ width: 180}}>
                <div align="left">
                  <b> $ {props.price || "price"} </b>
                  <br/>
                  Copies Sold: {props.sales || "0"}
                  <br/>
                  <br/>
                  Likes: {props.likes || "0"}
                  <br/>
                  <br/>
                  Views: {props.views || "0"}
                  <br/>
                </div>
              </Item>
            </Stack>
          </div>
        </Card>

  );
}

export default Adminbook;