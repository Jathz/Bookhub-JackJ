import { BACKEND_PORT } from './config.js';


// abstract api calls into this function since everything is the same except for path and body
// @param path {string} Path that needs to be called e.g. "cart"
// @param method {string} request method e.g. "GET"
// @param body {object} body of the request - null if no body needed
// @param setError {function to set a useState variable} - needed to display an error on product details page - just pass in null if irrelevant
// @param setErrorMsg {function to set a useState variable} - as above - pass in null if irrelevant
export function apiCall(path, method, body, setError) {
    // make this return a promise
    return new Promise((resolve, reject) => {
        console.log(path, method);
        fetch(`http://localhost:${BACKEND_PORT}/${path}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: method === "GET" ? undefined : JSON.stringify(body), // authToken needs to be passed in body if needed
        })
            .then(response => {
                if (!response) {
                    console.log("!response");
                    throw new Error('Could not fetch from backend')
                } else if (!response.ok) { // errors for failed status code
                    console.log("response status " +response.status);
                    throw new Error('Response status: '+response.status + " " + response.statusText);
                }
                return response.json();
            })
            .then(body => {
                if (!body) {
                    throw new Error("Request could not be completed"); //TODO something more elegant
                } else {
                    resolve(body); // use callback functions so the behaviour upon success is generalized
                }
            })
            .catch(error => {
                console.log(error.message);
                if (setError) {setError(error.message);}
            })
    })
}
