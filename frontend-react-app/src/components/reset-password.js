import React, { useState } from 'react';
import { Grid, Button, Typography, Link, LinearProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { useParams } from 'react-router-dom';

async function submitUser(details) {
    console.log("submitting");
    return fetch('http://localhost:5000/account/change_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(details)
    })
      .then(data => data.json())
   }

function ResetPassword() {
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const { token } = useParams();

    const handleSubmit = async (values) => {
        console.log(values);
        const res = await submitUser({
          "password": values["password"],
          "token": token
        });
        if (res["error"]) {
          setError(true);
        } else {
          setSuccess(true);
        }
      }
  if (success === true) {
    return (
      <div align="center">
        <h2>Your password has been changed.</h2>
      </div>
    );
  }
  return (
    <div align="center">
    <Grid direction="column" align="center" sx={{height: "70vh", width: "270px", paddingTop: "20px"}}>
        <h2>Reset Your Password</h2>
        <br />
        <Formik
        initialValues={{
            email: '',
        }}
        validate={(values) => {
          const errors = {};
          // password
          if (!values.password) {
            errors.password = 'Required';
          }

          // confirm password
          if (!values.passwordCheck) {
              errors.passwordCheck = 'Required';
          } else if (values.passwordCheck !== values.password) {
              errors.passwordCheck = "Password doesn't match";
          }

            return errors;
        }}

        onSubmit={(values, { setSubmitting }) => {
            delete values.passwordCheck;
            setTimeout(() => {
            setSubmitting(false);
            //alert(JSON.stringify(values, null, 2));
            handleSubmit(values);
            }, 500);
        }}
        >
        {({ submitForm, isSubmitting }) => (
            <Form>
                <div className="profile-label">Enter a new password:</div>
                <br />
            <Field
              component={TextField}
              fullWidth required
              type="password"
              label="New Password"
              name="password"
              placeholder="Enter password"
            />
            <br /> <br />
            <Field
                component={TextField}
                fullWidth required
                type="password"
                label="Confirm password"
                name="passwordCheck"
                placeholder="Confirm password"
            />
            <br /><br />
            <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
                fullWidth
            >
                SAVE
            </Button>
            </Form>
        )}
        </Formik>
        </Grid>
      </div>
    );
}

export default ResetPassword;