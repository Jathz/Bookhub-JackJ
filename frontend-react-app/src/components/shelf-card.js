import React, { useState, useEffect } from 'react';
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
import { getShelfBooks } from './shelf-api';

// props format
// props.title - shelf title
// props.createdBy - name of user who created the shelf
// props.collectionId {string (int)} - collection id
// props.margin {string} - e.g. 10px
function Shelfcard(props) {
    const [image, setImage] = useState(null);
    useEffect(() => {
        getShelfBooks(props.collectionId, alert).then(body => {
            console.log(body.result)
            if (body.result.length > 0){
                setImage(body.result[0].img_url);
            }
            // console.log(shelfBooks);
        });
    }, []); // needed to include dependency array otherwise would cause infinity loop
    
	return (
  	<Card sx={{ width: 135, height: 350, margin: props.margin}}>
        <Link to={"/shelf/"+props.collectionId}>
      <CardMedia
        component="img"
        alt="book cover"
        image= {image || require("../assets/defaultBookCover.jpg") || "https://i.imgur.com/ZmqBOOa.jpg"}
      />
      <CardContent sx={{paddingBottom: "0px"}}>
        {/* <img
            src={props.image || require("../assets/defaultBookCover.jpg") || "https://i.imgur.com/ZmqBOOa.jpg"}
            style={{width: "100px"}}
        /> */}
        <Typography gutterBottom variant="body" component="div">
          {props.title || "Shelf Title"}
        </Typography>
        <Typography gutterBottom variant="caption" component="div">
          Created By: {props.createdBy}
        </Typography>
      </CardContent>
      </Link>
    </Card>

  );
}

export default Shelfcard;