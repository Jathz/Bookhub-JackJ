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
import { editShelfApi } from './shelf-api';

// Called in shelf-component.js
// props.open
// props.setOpen
// props.title
// props.description
// props.collectionId
// props.setCollectionTitle - setState function to update collection title on screen
// props.setCollectionDescription - setState function to update collection description on screen
function EditShelfDialog(props) {
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
        editShelfApi(cookies.session, props.collectionId, values.title, values.description, setError).then( () => {//TODO: change userId to token
            if (error === false) {
                window.confirm("Changes saved");
                handleClose();
                props.setCollectionTitle(values.title);
                props.setCollectionDescription(values.description);
            }
        });
    }

    const editForm = (
    <div className="library-featured">
        <div align="left">
    <Grid direction="column" align="center" sx={{height: "70vh", width: "270px", paddingTop: "20px"}}>
        {error &&
            <Typography className="profile-label">Update unsuccessful</Typography>
        }
        <br />
        <Formik
        enableReinitialize={true}
        initialValues={{
            title: props.title,
            description: props.description,
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
        <DialogTitle>Edit Shelf</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit your shelf title and/or description here.
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


export default EditShelfDialog;
