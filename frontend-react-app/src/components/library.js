import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Slider from "react-slick";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import { apiCall } from './helper';
import './style.css'

async function getBooks(token) {
  return fetch("http://localhost:5000/book/get_my_books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(token)
  })
    .then(data => data.json())
 }

async function getWishlist(token) {
  return fetch("http://localhost:5000/book/get_wishlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(token)
  })
    .then(data => data.json())
 }

 async function getFavourites(token) {
    return fetch("http://localhost:5000/book/get_favourites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(token)
    })
      .then(data => data.json())
   }

   function getCollections(token, setError) {
    return apiCall(`collection/view_collections?token=${token}`, "GET", null, setError);
   }

   function getShelfBooks(id, setError) {
    return apiCall(`collection/view_books?collection_id=${id}`, "GET", null, setError);
   }

function Library() {
  const [isHovered, setHovered] = useState(false);
  const [isBooks, setBooks] = useState([]);
  const [isFavourites, setFavourites] = useState([]);
  const [isWishlist, setWishlist] = useState([]);
  const [isShelves, setShelves] = useState([]);
  const [cookies] = useCookies();
  const [ error, setError ] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      let book = await getBooks({"token": cookies.session})
      console.log(book["result"]);
      setBooks(book["result"]);
    }
    async function fetchFavourites() {
        let favourites = await getFavourites({"token": cookies.session})
        setFavourites(favourites["result"]);
    }
    async function fetchWishlist() {
      let wishlist = await getWishlist({"token": cookies.session})
      setWishlist(wishlist["result"]);
    }
    getCollections(cookies.session, setError).then(body => {
      let collection = body.result["my_collection"];
      // iterate over all the shelves and add an image
      // field to store the first book cover in the shelf
      for (var i = 0; i < collection.length; i++) {
        let shelf = collection[i];
        let id = shelf["collection_id"];
        getShelfBooks(id, setError).then(body => {
          if (body.result.length > 0) {
            shelf["img"] = body.result[0]["img_url"];
          // if there is no books in the shelf, set default cover
          } else {
            shelf["img"] = "https://i.imgur.com/KYlw9xx.jpg";
          }
        })
      }
      setShelves(collection);
    })
    fetchBooks();
    fetchFavourites();
    fetchWishlist();
  }, []);

  const NextArrow = ({onClick}) => {
    return (
      <div className="library-arrow library-next" onClick={onClick}>
        <ArrowForwardIosIcon />
      </div>
    )
  }

  const PrevArrow = ({onClick}) => {
    return (
      <div className="library-arrow library-prev" onClick={onClick}>
        <ArrowBackIosIcon />
      </div>
    )
  }
  const settings = {
    infinite: false,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  }

    return (
    <div className="library-featured">
        <h1 className="library-header">
            My Library
        </h1>
      <div className="library-bestseller">
        <span className="library-title">My Favourites</span>
        <span><a href="/my-faves">View All</a></span>
        <div className="library-wrapper">
          <Slider {...settings}>
            {isFavourites.map((books, idx) => (
              <div 
              className={"library-slide1"} 
              onMouseEnter={() => setHovered(true)} 
              onMouseLeave={() => setHovered(false)}
              >
                <a href={"/product-detail/" + books["id"]}><img src={books["img"]} /></a>
                {isHovered && (
                  <>
                    <a href="/cart?id=">
                      <div className="library-icons">
                        <ShoppingCartOutlinedIcon />
                      </div>
                    </a>
                  </>
                )}
                <span className="library-bookname">{books["title"]}</span>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="library-bestseller">
        <span className="library-title">My Wishlist</span>
        <span><a href="/my-wishlist">View All</a></span>
        <div className="library-wrapper">
          <Slider {...settings}>
            {isWishlist.map((books, idx) => (
              <div 
              className={"library-slide1"} 
              onMouseEnter={() => setHovered(true)} 
              onMouseLeave={() => setHovered(false)}
              >
                <a href={"/product-detail/" + books["id"]}><img src={books["img"]} /></a>
                {isHovered && (
                  <>
                    <a href="/cart?id=">
                      <div className="library-icons">
                        <ShoppingCartOutlinedIcon />
                      </div>
                    </a>
                  </>
                )}
                <span className="library-bookname">{books["title"]}</span>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="library-bestseller">
        <span className="library-title">My Shelves</span>
        <span><a href="/shelves">View All</a></span>
        <div className="library-wrapper">
          <Slider {...settings}>
            {isShelves.map((shelf, idx) => (
              <div 
              className={"library-slide1"} 
              onMouseEnter={() => setHovered(true)} 
              onMouseLeave={() => setHovered(false)}
              >
                <a href={"/shelf/" + shelf["collection_id"]}><img src={shelf["img"]}/></a>
                <span className="library-bookname">{shelf["title"]}</span>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="library-bestseller">
        <span className="library-title">My Books</span>
        <span><a href="/my-books">View All</a></span>
        <div className="library-wrapper">
          <Slider {...settings}>
            {isBooks.map((books, idx) => (
              <div 
              className={"library-slide1"} 
              onMouseEnter={() => setHovered(true)} 
              onMouseLeave={() => setHovered(false)}
              >
                <a href={"/book/" + books["id"]}><img src={books["img"]} /></a>
                <span className="library-bookname">{books["title"]}</span>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="library-bestseller"></div>
    </div>
  )
}

export default Library;