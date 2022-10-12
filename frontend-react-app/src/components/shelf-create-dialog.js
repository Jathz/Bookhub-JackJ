import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, Button, Typography, Link, LinearProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { createShelfApi } from './shelf-api';

// Called in shelves.js
// props.open
// props.setOpen
// props.shelvesList - list of user's shelves - append new shelf to this so it updates on the frontend
// props.setShelvesList - setState function to update shelves list on the frontend when a new shelf is created
function CreateShelfDialog(props) {
    const [ cookies, setCookie ] = useCookies();
    // console.log(cookies.session);
    const [error, setError] = useState(false);


//   props.open === "true" ? props.open = true : props.open = false;
//   console.log("a", props.open, "b", props.setOpen);

    const handleClose = () => {
        setError(false);
        props.setOpen(false);
    };

    const handleSubmit = (values) => {
        createShelfApi(cookies.session, values.title, values.description, setError).then( (body) => {//TODO: change userId to token
            if (error === false && body.result !== "false") {
                window.confirm("Shelf created");
                handleClose();
                let newShelvesList = props.shelvesList.map(a => a);
                // console.log(newShelvesList);
                newShelvesList.push({
                    "collection_id": body.collection_id,
                    "title": values.title,
                    "description": values.description,
                    "creator_id": -1
                });
                // console.log(newShelvesList);
                props.setShelvesList(newShelvesList);
            }
        });
    }

    const createForm = (
    <div className="library-featured">
        <div align="left">
    <Grid direction="column" align="center" sx={{height: "70vh", width: "270px", paddingTop: "20px"}}>
        {error &&
            <Typography className="profile-label">Could not create shelf</Typography>
        }
        <br />
        <Formik
        enableReinitialize={true}
        initialValues={{
            title: '',
            description: '',
        }}
        validate={(values) => {
            const errors = {};
            // title
            if (!values.title) {
                errors.title = 'Required';
            }

            // description
            if (!values.description) {
                errors.description = 'Required';
            } 
            return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
            // title
            if (!values.title) {
                values.title = props.title;
            }

            // description
            if (!values.description) {
                values.description = props.description;
            }
            setTimeout(() => {
            setSubmitting(false);
            //alert(JSON.stringify(values, null, 2));
            handleSubmit(values);
            }, 500);
        }}
        >
        {({ submitForm, isSubmitting }) => (
            <Form>
                <Typography className="profile-label">Shelf Title:</Typography>
            <Field
                component={TextField}
                fullWidth required
                name="title"
                label=""
                placeholder=""
            />
            <br /><br />
                <Typography className="profile-label">Shelf Description:</Typography>
            <Field
                component={TextField}
                fullWidth
                name="description"
                label=""
                placeholder=""
            />
            <br /><br />
            {isSubmitting && <LinearProgress />}
            <br /><br />
            <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
                fullWidth
            >
                Create shelf
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
    <div style={{margin: "auto", backgroundColor: 'aqua'}}>
      <Dialog
        open={props.open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Create Shelf</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your shelf title and description.
          </DialogContentText>
        
          {createForm}
          
        </DialogContent>
        <DialogActions sx={{paddingRight: "20px", paddingBottom: "15px"}}>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export default CreateShelfDialog;
