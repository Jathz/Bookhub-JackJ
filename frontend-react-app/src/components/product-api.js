import React from 'react';
import { apiCall } from './helper';

// used in product-detail.js
export function getBookDetails(bookId, setError) {
    return apiCall(`book/view?id=${bookId}`, "GET", null, setError);
}

export function bookRemoveApi(token, bookId, setError) {
    return apiCall("book/delete", "POST", {
        token,
        id: bookId
    }, setError);
}

// used in product-edit-dialog.js
export function bookEditApi(
    token,
    id,
    name,
    price,
    publisher,
    publish_date,
    description,
    genres,
    image,
    author,
    number_of_pages,
    isbn,
    language_written,
    age_restriction,
    setError
) {
    console.log(price);
    // console.log(
    //     id,
    //     name,
    //     price,
    //     publisher,
    //     publish_date,
    //     description,
    //     genres,
    //     image,
    //     author,
    //     number_of_pages,
    //     isbn,
    //     language_written,
    //     age_restriction
    // );
    return apiCall("book/edit", "POST", {
        token,
        id,
        name,
        price,
        publisher,
        publish_date : publish_date !== "" ? `'${publish_date}'` : 'NULL', // double layer quotation mark is required if value != null
        description,
        genres,
        image,
        author,
        number_of_pages : number_of_pages !== "" ? `'${number_of_pages}'` : 'NULL',
        isbn,
        language_written,
        age_restriction
    }, setError);
}

export function getBookRating(bookId, setError){
    return apiCall(`rating/get?book_id=${bookId}`, "GET", null, setError);
}