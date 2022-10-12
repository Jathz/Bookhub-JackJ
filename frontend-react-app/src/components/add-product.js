import { useState, useEffect } from 'react';
import styles from "./home.module.css";

import { useCookies } from 'react-cookie';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

import { Grid, Button, Typography, Link, LinearProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import './style.css'

import { apiCall } from './helper';

import BookCard from './book-card.js';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


 async function submitBook(title, prices, pub, pubDate, des, genre, auth, numPages, isb, lang, ageRes, img, authToken, setError){
  console.log(title);
  console.log(prices);
  console.log(pub);
  console.log(pubDate);
  console.log(des);
  console.log(genre);
  console.log(authToken);
  console.log(typeof(authToken));
  return apiCall("book/add", "POST", {
        token: authToken,
        name: title,
        price: prices,
        publisher: pub,
        publish_date: pubDate,
        description: des,
        genres: genre,
        image: img,
        author: auth,
        number_of_pages: numPages,
        isbn: isb,
        language_written: lang,
        age_restriction: ageRes,
    }, setError); 
}

function AddProduct() {
  const [cookies] = useCookies();
  const [error, setError] = useState(false);
  const handleSubmit = async (values) => {
      const res = await submitBook(values["title"], values["prices"], values["publisher"], values["publisher_date"], 
        values["description"], values["genre"], values["author"], values["number_of_Pages"], values["ISBN"], values["language"], 
        values["age_restriction"], values["image"], cookies.session, alert);
      if(res["error"]){
        console.log("err");
        setError(true);
      }
    setTimeout(() => {  window.location='/add-product';}, 300); 
  }
  console.log("enters");
	return (
	<div className="App">
	<font face="Arial">
  <div align="center">
  <br/>
        <Container fixed>
          <Box sx={{ bheight: '100vh' }}>
            <p><b> New E-Book</b></p>
            
            <br/>
            <Formik
              enableReinitialize={true}
              initialValues={{
                title: '',
              }}
              validate={(values) => {
                const errors = {};
                  if (!values.title) {
                    errors.first = 'Required';
                  }
                  return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                  console.log("test");
                  handleSubmit(values);
                },500);
              }}
              >
              {({ submitForm, isSubmitting }) => (
                  <Form>
                    <div className="profile-label">Title:</div>
                  <Field
                      component={TextField}
                      fullWidth required
                      name="title"
                      label=""
                      placeholder=""
                  />
                  <br /><br />
                    <div className="profile-label">Price:</div>
                  <Field
                      component={TextField}
                      fullWidth
                      name="prices"
                      label=""
                      placeholder=""
                  />
                  <br /><br />
                    <div className="profile-label">Publisher:</div>
                  <Field
                      component={TextField}
                      fullWidth required
                      name="publisher"
                      label=""
                      placeholder=""
                  />
                  <br /><br />
                    <div className="profile-label">Published Date:</div>
                  <Field
                      component={TextField}
                      fullWidth required
                      name="publisher_date"
                      label=""
                      placeholder=""
                  />
                  <br /><br />
                    <div className="profile-label">Description:</div>
                  <Field
                      component={TextField}
                      fullWidth required
                      name="description"
                      label=""
                      placeholder=""
                  />
                  <br /><br />
                    <div className="profile-label">Genre:</div>
                  <Field
                      component={TextField}
                      fullWidth required
                      name="genre"
                      label=""
                      placeholder=""
                  />
                  <br /><br />
                    <div className="profile-label">Author:</div>
                  <Field
                      component={TextField}
                      fullWidth required
                      name="author"
                      label=""
                      placeholder=""
                  />
                  <br /><br />
                    <div className="profile-label">Number of pages:</div>
                  <Field
                      component={TextField}
                      fullWidth required
                      name="number_of_Pages"
                      label=""
                      placeholder=""
                  />
                  <br /><br />
                    <div className="profile-label">ISBN:</div>
                  <Field
                      component={TextField}
                      fullWidth required
                      name="ISBN"
                      label=""
                      placeholder=""
                  />
                  <br /><br />
                    <div className="profile-label">Language:</div>
                  <Field
                      component={TextField}
                      fullWidth required
                      name="language"
                      label=""
                      placeholder=""
                  />
                  <br /><br />
                    <div className="profile-label">Age Restriction:</div>
                  <Field
                      component={TextField}
                      fullWidth required
                      name="age_restriction"
                      label=""
                      placeholder=""
                  />
                  <br /><br />
                    <div className="profile-label">Image:</div>
                  <Field
                      component={TextField}
                      fullWidth required
                      name="image"
                      label=""
                      placeholder=""
                  />
                  <br /><br />
                  
                  <br /><br />
                  <Button
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={submitForm}
                      fullWidth
                  >
                      Save Changes
                  </Button>
            </Form>
        )}
        </Formik>
           </Box>
        </Container>
	   <br/>
     </div>
  	</font>
  	</div>

  );
}

export default AddProduct;




