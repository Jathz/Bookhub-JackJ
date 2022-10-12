import './App.css';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import  { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { deepPurple } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import LogIn from './components/login';
import ConfirmEmail from './components/confirm-email';
import ForgotPassword from './components/forgot-password';
import ResetPassword from './components/reset-password';
import Home from './components/home';
import TopNav from './components/top-bar.js';
import BotNav from './components/bot-bar.js';
import Register from './components/register';
import ProductDetail from './components/product-detail';
import Cart from './components/cart';
import Checkout from './components/checkout';
import Admin from './components/admin';
import AddProduct from './components/add-product';
import ViewSales from './components/view-sales';
import Shelves from './components/shelves';
import Shelf from './components/shelf';
import Library from './components/library';
import Profile from './components/profile';
import Browse from './components/browse';
import Book from './components/book';
import Myfaves from './components/my-faves';
import Mywishlist from './components/my-wishlist';
import Mybooks from './components/my-books';
import SearchResult from './components/search-results';

async function verifyCookie(token) {
  return fetch("http://localhost:5000/account/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(token)
  })
    .then(data => data.json())
 }

 const theme = createTheme({
    palette: {
      primary: {
        main: deepPurple[500],
      },
    },
  });

function App() {
  const [ Guest, setGuest ] = useState(true);
  const [ cookies ] = useCookies();

  useEffect(() => {
    if (!cookies.session) {
        // console.log("set guest to true");
        setGuest(true);
    } else {
      async function fetchSession() {
        let valid = await verifyCookie({"token": cookies.session})
        //console.log(valid);
        if (valid["valid"] || valid["valid"] === "true") {
            // console.log("if");
            setGuest(false);
        } else {
          setGuest(true);
        //   console.log("else");
        }
      }
      fetchSession();
    }
  })

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
        <div className="App-body">
            <TopNav Guest={Guest}/>
            <Router> {/* adapted from https://www.geeksforgeeks.org/how-to-redirect-to-another-page-in-reactjs/ */}
                <Routes>
                {/* This route is for home component 
                with exact path "/", in component props 
                we passes the imported component*/}
                <Route exact path="/" element={<Home />} />
                    
                {/* This route is for about component 
                with exact path "/login", in component 
                props we passes the imported component*/}
                <Route path="/login" element={!Guest ? <Home /> : <LogIn/>} />
                
                <Route path="/library" element={<Library />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/shelf/:collId" element={<Shelf />}/>
                <Route path="/my-faves" element={<Myfaves />}/>
                <Route path="/my-wishlist" element={<Mywishlist />}/>
                <Route path="/my-books" element={<Mybooks />}/>
                <Route path="/browse" element={<Browse />}/>
                <Route path="/cart" element={<Cart/>} />
                <Route path="/checkout" element={<Checkout/>} />
                <Route path="/admin" element={<Admin/>} />
                <Route path="/add-product" element={<AddProduct/>} />
                <Route path="/view-sales" element={<ViewSales/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/confirm_email/:emailToken" element={<ConfirmEmail/>} />
                <Route path="/product-detail/:bookId" element={<ProductDetail />} />
                <Route path="/shelves" element={<Shelves />} />
                <Route path="/book/:bookId" element={<Book />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/search-result/:query" element={<SearchResult />} />
                
                {/* If any route mismatches the upper 
                route endpoints then, redirect triggers 
                and redirects app to home component with to="/" */}
                <Route
                    path="*"
                    element={<Navigate to="/" />}
                />
                </Routes>
            </Router>
        </div>
        <BotNav />
    </div>
    </ThemeProvider>
  );
}

export default App;

