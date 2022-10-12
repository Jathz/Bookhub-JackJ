import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

async function verifyEmail(props) {
  return fetch("http://localhost:5000/account/confirm_email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(props)
  })
    .then(data => data.json())
 }

export default function ConfirmEmail() {
  const [ confirmationMessage, setConfirmation ] = useState("This link is either expired or invalid.");
  const { emailToken } = useParams();
  useEffect(() => {
    async function fetchError() {
      let res = await verifyEmail({"token": emailToken});
      if (res["error"] === "") {
        setConfirmation("Your email has been successfully validated");
      }
    }
    fetchError();
  })
  return(
    <h1>{ confirmationMessage }</h1>
  );
}
