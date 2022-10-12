import React from 'react';
import { apiCall } from './helper';

export function getCartBooks(authToken, setError) {
    return apiCall(`cart/view?token=${authToken}`, "GET", null, setError);
}

export function getCartBookes(authToken, setError) {
    return apiCall("cart/view_books", "POST", {
        token: authToken
    }, setError);
}

export function getCartPrice(authToken, setError) {
    return apiCall("cart/price", "POST", {
        token:authToken
    }, setError);
}

export function removeBookFromCart(authToken, bookId, setError){
  console.log(bookId);
  return apiCall("cart/remove", "POST", {
        token: authToken,
        book_id: bookId
    }, setError); 
}

export function buyCart(authToken, setError){
    return apiCall("cart/buy", "POST", {
        token: authToken
    }, setError);
}

export function addToCart(authToken, bookId, setError){
    return apiCall("cart/add", "POST", {
        token: authToken,
        book_id: bookId
    }, setError);
}
