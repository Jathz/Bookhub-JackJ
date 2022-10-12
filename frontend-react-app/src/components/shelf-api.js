import React from 'react';
import { apiCall } from './helper';

// used in shelf.js, shelves.js, shelf-add-btn.js
export function getShelves(authToken, setError) {
    return apiCall(`collection/view_collections?token=${authToken}`, "GET", null, setError);
}

// used in shelf-component.js
export function getShelfBooks(collectionId, setError) {
    return apiCall(`collection/view_books?collection_id=${collectionId}`, "GET", null, setError);
}

// used in shelf-component.js
export function removeBookFromShelf(bookId, collectionId, authToken, setError) {
    return apiCall("collection/delete_book", "POST", {
        token: authToken,
        book_id: bookId,
        collection_id: collectionId
    }, setError); 
}

// used in shelves.js
export function deleteShelfApi(token, collectionId, setError) {
    return apiCall("collection/delete_collection", "POST", {
        token,
        collection_id: collectionId
    }, setError); 
}

// used in shelf-component.js -> shelf-edit-btn.js
export function editShelfApi(token, collectionId, title, description, setError) {
    return apiCall("collection/edit_collection", "POST", {
        token,
        collection_id: collectionId,
        title,
        description
    }, setError); 
}

// used in shelves.js -> shelf-create-dialog.js
export function createShelfApi(token, title, description, setError) {
    return apiCall("collection/create_collection", "POST", {
        token,
        title,
        description
    }, setError); 
}

// used in shelf-add-btn.js
export function addBookToShelfApi(token, bookId, collectionId, setError) {
    return apiCall("collection/add_book", "POST", {
        token,
        book_id: bookId,
        collection_id: collectionId
    }, setError); 
}

// used in shelf-component.js
export function checkIsOwnerApi(token, collectionId, setError) {
    if (!token) token = "";
    console.log(token);
    return apiCall("collection/check_is_owner", "POST", {
        token,
        collection_id: collectionId
    }, setError); 
}

// used in shelf-component.js
export function followCollectionApi(token, collectionId, setError) {
    if (!token) token = "";
    console.log(token);
    return apiCall("collection/copy_collection", "POST", {
        token,
        collection_id: collectionId
    }, setError); 
}