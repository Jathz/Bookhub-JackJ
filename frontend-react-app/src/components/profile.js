import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Grid, Button, Typography, Link, LinearProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import './style.css'

async function submitUser(details) {
  console.log("submitting");
  return fetch('http://localhost:5000/account/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(details)
  })
    .then(data => data.json())
 }

   async function getDetails(token) {
    return fetch('http://localhost:5000/account/get_details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(token)
    })
      .then(data => data.json())
   }

function Profile() {
  const [cookies] = useCookies();
  const [error, setError] = useState(false);
  const [getFirst, setFirst] = useState();
  const [getLast, setLast] = useState();
  const [getEmail, setEmail] = useState();

  useEffect(() => {
    async function fetchDetails() {
        let details = await getDetails({"token": cookies.session})
        setFirst(details["first"]);
        setLast(details["last"]);
        setEmail(details["email"]);
        console.log(getEmail);
    }
    fetchDetails();
  }, []);

  const handleSubmit = async (values) => {
      const res = await submitUser({
        "email": values["email"],
        "password": values["password"],
        "first": values["first"],
        "last": values["last"],
        "token": cookies.session
      });
      if (res["error"]) {
        setError(true);
      }
    }

  return (
    <div className="library-featured">
        <div align="center">
    <Grid direction="column" align="center" sx={{height: "70vh", width: "270px", paddingTop: "20px"}}>
        <h2>My Profile</h2>
        {error &&
            <p>Email is already in use</p>
        }
        <br />
        <Formik
        enableReinitialize={true}
        initialValues={{
            email: getEmail,
            password: '',
            first: getFirst,
            last: getLast,
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

            // confirm password
            if (values.password && !values.passwordCheck) {
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
              <div className="profile-label">First Name:</div>
            <Field
                component={TextField}
                fullWidth required
                name="first"
                label=""
                placeholder=""
            />
            <br /><br />
              <div className="profile-label">Last Name:</div>
            <Field
                component={TextField}
                fullWidth
                name="last"
                label=""
                placeholder=""
            />
            <br /><br />
              <div className="profile-label">Email:</div>
            <Field
                component={TextField}
                fullWidth required
                name="email"
                type="email"
                label=""
                placeholder=""
            />
            <br /><br />
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
      <div className="profile-separate"></div>

    </div>
  )
}

export default Profile;