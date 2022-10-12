import React, { useState } from 'react';

import { Grid, Button, Typography, Link, LinearProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';

async function submitUser(details) {
    console.log("submitting");
    return fetch('http://localhost:5000/account/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(details)
    })
      .then(data => data.json())
   }

function Register() {
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState(null);

    const handleSubmit = async (values) => {
        setEmail(values["email"]);
        const res = await submitUser({
          "email": values["email"],
          "password": values["password"],
          "first": values["first"],
          "last": values["last"]
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
                <h3>A confirmation email has been sent to {email}.</h3>
            </div>
        );
    }
    return (
    <div align="center">
    <Grid direction="column" align="center" sx={{height: "70vh", width: "270px", paddingTop: "20px"}}>
        <h2>Register</h2>
        {error &&
            <p>Email is already in use</p>
        }
        <br />
        <Formik
        initialValues={{
            email: '',
            password: '',
            first: '',
            last: '',
            passwordCheck: '',
        }}
        validate={(values) => {
            const errors = {};
            // first name
            if (!values.first) {
                errors.first = 'Required';
            }

            // email
            if (!values.email) {
            errors.email = 'Required';
            } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
            errors.email = 'Invalid email address';
            }

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
            <Field
                component={TextField}
                fullWidth required
                name="first"
                label="First name"
                placeholder="Enter first name"
            />
            <br /><br />

            <Field
                component={TextField}
                fullWidth
                name="last"
                label="Last name"
                placeholder="Enter last name"
            />
            <br /><br />

            <Field
                component={TextField}
                fullWidth required
                name="email"
                type="email"
                label="Email address"
                placeholder="Enter email address"
            />
            <br /><br />
            <Field
                component={TextField}
                fullWidth required
                type="password"
                label="Password"
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
            {isSubmitting && <LinearProgress />}
            <br /><br />
            <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
                fullWidth
            >
                SIGN UP
            </Button>
            </Form>
        )}
        </Formik>

        <br />
        <Typography>
            Already have an account?{' '}
            <Link href="login">Log In</Link>
        </Typography>
        <br /><br />

        </Grid>
      </div>
    );
}

export default Register;