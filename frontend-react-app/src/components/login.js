import React, { useState } from 'react';

import { useCookies } from 'react-cookie'
import { Box, Grid, Button, FormControlLabel, Checkbox, Typography, Link, LinearProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';

async function loginUser(credentials) {
    return fetch("http://localhost:5000/account/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    })
    .then(data => data.json())
}

function LogIn() {
    const [ cookies, setCookie ] = useCookies("session");
    const [ error, setError ] = useState(false);

    const handleSubmit = async (values)=> {
        console.log("tet");
        const token = await loginUser({
          "email": values['email'],
          "password": values['password']
        });
        if (token["error"] === "") {
          setCookie("session", token["token"], { secure: true });
          setError(false);
        } else {
          setError(true);
        }
    }

  return (
    <Grid align="center">
    <Grid container direction="column" align="center" sx={{height: "80vh", width: "270px", paddingTop: "50px"}}>
        <h2>Log In</h2>
        {error &&
            <p>Incorrect email or password</p>
        }   
        <br />
        <Formik
        initialValues={{
            email: '',
            password: '',
        }}
        validate={(values) => {
            const errors = {};
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
            console.log(values);
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
            {isSubmitting && <LinearProgress />}
            <br /><br />
            <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
                fullWidth
            >
                LOG IN
            </Button>
            </Form>
        )}
        </Formik>
        <br /><br />
        <div>
        <Typography>
            <Link href="forgot-password">Forgot your password?</Link>
        </Typography>
        <Typography>
            Don't have an account?{' '}
            <Link href="register">Sign up</Link>
        </Typography>
        </div>

        </Grid>
      </Grid>
    );
}

export default LogIn;