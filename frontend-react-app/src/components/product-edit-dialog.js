import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, Button, Typography, Link, LinearProgress, TextField as MuiTextField} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { bookEditApi } from './product-api';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import './style.css'
import { apiCall } from './helper';

function getGenres(setError) {
    return apiCall("genre", "GET", null, setError);
}

function getGenreId(genresList, genreName) {
    // console.log(genresList);
    // console.log(genreName);
    for (const genre of genresList) {
        if (genreName === genre.genre_description) {
            console.log(genre.genre_id);
            return genre.genre_id;
        }
    }
}

// Called in product-detail.js
// props.open
// props.setOpen
// props.bookInfo - object that contains info of the book e.g. {"result": {"book": {"book_id": 1, "book_name": "Spy X Family Vol. 1", "price": 100, "view_number": 0, "number_sold": 0, "like_number": 0, "publisher": null, "publish_date": null, "description": null, "img_url": "https://i.imgur.com/EISu6cm.jpg", "author": "Tatsuya Endo", "number_of_pages": null, "language_written": null, "isbn": null, "age_restriction": null}, "genres": []}}
// props.collectionId
function ProductEditDialog(props) {
    const [ cookies, setCookie ] = useCookies();
    // console.log(cookies.session);
    const [error, setError] = useState(false);
    const [genres, setGenres] = useState(null);
    const bookInfo = props.bookInfo;
    console.log(bookInfo);

    useEffect(() => {
        getGenres(setError).then(body => {
            // console.log(body.result);
            setGenres(body.result);
        });

    }, []); // needed to include dependency array otherwise would cause infinity loop

    const handleClose = () => {
        setError(false);
        props.setOpen(false);
    };

    const handleSubmit = (values) => {
        bookEditApi(
            cookies.session,
            bookInfo.book.book_id,
            values.book_name,
            values.price,
            values.publisher,
            values.publish_date,
            values.description,
            values.genres,
            values.img_url,
            values.author,
            values.number_of_pages,
            values.isbn,
            values.language_written,
            values.age_restriction,
            setError
        ).then( body => {//TODO: change userId to token
            if (body.result === "false") {
                setError("Request could not be completed");
                console.log(error);
            } else if (body.result === "true") {
                setError(false);
                window.confirm("Changes saved");
                handleClose();
            }
        });
    }

    const params = [
        "book_name",
        "price",
        "author",
        "description",
        "publisher",
        "publish_date",
        "number_of_pages",
        "img_url",
        "language_written",
        "isbn",
        "age_restriction",
        "genres"
    ]

    const editForm = (
    <div className="library-featured">
        <div align="left">
    <Grid direction="column" align="center" sx={{height: "70vh", width: "270px", paddingTop: "20px"}}>
        {error &&
            <Typography className="profile-label">Update unsuccessful: {error}</Typography>
        }
        <br />
        <Formik
        enableReinitialize={true}
        initialValues={{
            book_name: bookInfo.book.book_name,
            price: bookInfo.book.price ? bookInfo.book.price : "",
            author: bookInfo.book.author ? bookInfo.book.author : "",
            description: bookInfo.book.description ? bookInfo.book.description : "",
            publisher: bookInfo.book.publisher ? bookInfo.book.publisher : "",
            publish_date: bookInfo.book.publish_date ? bookInfo.book.publish_date : "",
            number_of_pages: bookInfo.book.number_of_pages ? bookInfo.book.number_of_pages : "",
            img_url: bookInfo.book.img_url ? bookInfo.book.img_url : "",
            language_written: bookInfo.book.language_written ? bookInfo.book.language_written : "",
            isbn: bookInfo.book.isbn ? bookInfo.book.isbn : "",
            age_restriction: bookInfo.book.age_restriction ? bookInfo.book.age_restriction : "",
            genres: bookInfo.genres.toString() ? genres && bookInfo.genres.map((genreName) => getGenreId(genres, genreName[0])).toString() : ""
        }}
        validate={(values) => {
            const errors = {};
            // book name
            if (!values.book_name) {
                errors.book_name = 'Required';
            }
            // price
            if (!values.price) {
                errors.price = 'Required';
            }
            // author
            if (!values.author) {
                errors.author = 'Required';
            }
            // check that price and number_of_pages are numbers
            if(!(/^-?\d*(\.\d+)?$/).test(values.price)) {
                // not numeric
                errors.price= 'Must be numeric';
            }
            if (isNaN(values.number_of_pages)) {
                // not integer
                errors.number_of_pages= 'Must be an integer';
            }

            // convert genres to an array
            if (values.genres.length > 1) {
                console.log("hi");
                console.log(typeof(values.genres));
                values.genres = String(values.genres);
                values.genres = values.genres.replaceAll(" ","");
                values.genres = values.genres.split(",");
            }

            return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
            // set value to existing value if input is empty
            // for (const key of Object.keys(values)) {
            //     if (!values[key]) {
            //         values[key] = bookInfo.book[key] ? bookInfo.book[key] : "";
            //     }
            // }
            setTimeout(() => {
            setSubmitting(false);
            //alert(JSON.stringify(values, null, 2));
            handleSubmit(values);
            }, 500);
        }}
        >
        {({ submitForm, isSubmitting, values }) => (
            <Form>
                {params.map((param) => (
                <div>
                    <Typography className="profile-label capitalize">{param.replaceAll('_', ' ')}:</Typography>
                        <Field
                            component={TextField}
                            type={(param==="publish_date") && "date"|| "text"}
                            fullWidth
                            name={param}
                            label=""
                            placeholder={param=="genres" ? "A list of genre_id's - e.g.'0,1,2'" : ""}
                        />
                    <br /><br />
                </div>
                ))}
                {/* genre as a dropdown list */}
                {/* <Typography className="profile-label capitalize">Genres:</Typography>
                <Field
                    as="select"
                    fullWidth
                    name="genres"
                    style={{width: "100%", height: "40px"}}
                >sdafasd
                    <option value="1">1</option>
                </Field> */}
            {isSubmitting && <LinearProgress />}
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

        <br />
        <br /><br />

        </Grid>
        </div>

    </div>
    )


  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit product information here.
          </DialogContentText>
        
          {editForm}
          
        </DialogContent>
        <DialogActions sx={{paddingRight: "20px", paddingBottom: "15px"}}>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export default ProductEditDialog;
