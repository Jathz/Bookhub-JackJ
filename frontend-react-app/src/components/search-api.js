import React from 'react';
import { apiCall } from './helper';


export function searchApi(query, setError) {
    return apiCall(`search?query=${query}`, "GET", null, setError); 
}
