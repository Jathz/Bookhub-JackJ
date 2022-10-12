import React from 'react';
import { apiCall } from './helper';

export function checkIsAdmin(token, setError) {
    if (!token) token = "";
    console.log(token);
    return apiCall("account/is_admin", "POST", {
        token
    }, setError);
}