import React, { useState } from 'react';
import { Grid, Button, Typography, Link, LinearProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';

async function submitUser(details) {
    console.log("submitting");
    return fetch('http://localhost:5000/account/reset_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(details)
    })
      .then(data => data.json())
   }

function ForgotPassword() {
    const [error, setError] = useState(false);
    const [email, setEmail] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (values) => {
        setEmail(values["email"]);
        const res = await submitUser({
          "email": values["email"]
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
              <h3>Your reset link has been sent to {email}.</h3>
          </div>  
        );
    }
  return (
    <div align="center">
    <Grid direction="column" align="center" sx={{height: "70vh", width: "270px", paddingTop: "20px"}}>
        <h2>Forgot Your Password</h2>
        <br />
        <Formik
        initialValues={{
            email: '',
        }}
        validate={(values) => {
            const errors = {};
            // email
            if (!values.email) {
            errors.email = 'Required';
            } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
            errors.email = 'Invalid email address';
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
                <div className="profile-label">Enter your email address and we will send you a recovery code.</div>
                <br />
            <Field
                component={TextField}
                fullWidth required
                name="email"
                label="Email address"
                placeholder="Enter email address"
            />
            <br /><br />
            <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
                fullWidth
            >
                SUBMIT
            </Button>
            </Form>
        )}
        </Formik>
        </Grid>
      </div>
    );
}

export default ForgotPassword;