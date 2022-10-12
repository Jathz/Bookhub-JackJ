import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Slider from "react-slick";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import { addToCart } from './cart-api.js';
import { apiCall } from './helper';
import './style.css';

function addCart(authToken, bookId){
  addToCart(authToken, bookId, alert);
}

async function getTopSellers() {
  return fetch("http://localhost:5000/book/top_sellers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(data => data.json())
 }

 async function getNewReleases() {
  return fetch("http://localhost:5000/book/new_releases", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(data => data.json())
 }

 function getRecs(token, setError) {
  return apiCall(`recommend/history`, "POST", token, setError);
 }

 function getSentiment(setError) {
  return apiCall(`sentiment/top`, "GET", null, setError);
 }

function Home() {
  const [cookies] = useCookies();
  const [ error, setError ] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setHovered] = useState(false);
  const [topSellers, setTopSellers] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [recommend, setRecommend] = useState(null);

  useEffect(() => {
    async function fetchTop() {
      let book = await getTopSellers();
      setTopSellers(book["result"]);
    }
    async function fetchNew() {
      let book = await getNewReleases();
      setNewReleases(book["result"]);
    }
    getSentiment(cookies.session, setError).then(body => {
      setSentiment(body.result);
    })
    getRecs({"token":cookies.session}, setError).then(body => {
      setRecommend(body.result["result"]);
      //console.log(body.result);
    })
    // getRecs(1, setError).then(body => {
    //   console.log("AAAAAA");
    //   console.log(body.result);
    // })
    fetchTop();
    fetchNew();
  }, []);

  const NextArrow = ({onClick}) => {
    return (
      <div className="home-arrow home-next" onClick={onClick}>
        <ArrowForwardIosIcon />
      </div>
    )
  }

  const PrevArrow = ({onClick}) => {
    return (
      <div className="home-arrow home-prev" onClick={onClick}>
        <ArrowBackIosIcon />
      </div>
    )
  }

  const settings = {
    infinite: true,
    lazyLoad: true,
    speed: 300,
    slidesToShow: 3,
    centerMode: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setImageIndex(next),
  };

  const settings1 = {
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  }

	return (
    <div className="home-feature">
      <div className="home-splash">
        {/*Placeholder background image*/}
        <img src="https://i0.wp.com/anitrendz.net/news/wp-content/uploads/2022/03/spy-x-family-key-visual-scaled-e1646617001724.jpg"/>
      </div>
      <div className="home-carousel">
        <Slider {...settings}>
          {topSellers.map((books, idx) => (
            <div className={idx === imageIndex ? "home-slide home-activeSlide" : "home-slide"}>
              <a href={"/product-detail/" + books["id"]}><img src={books["img"]} /></a>
              <div className="home-desc">
              <span className="home-title">{books["title"]}</span>
                {/* <span className="home-price">
                  $4.99
                </span> */}
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className="home-bestseller">
        <span className="home-title">Best Sellers</span>
        <div className="home-wrapper">
          <Slider {...settings1}>
            {topSellers.map((books, idx) => (
              <div 
              className={"home-slide1"} 
              onMouseEnter={() => setHovered(true)} 
              onMouseLeave={() => setHovered(false)}
              >
                <a href={"/product-detail/" + books["id"]}><img src={books["img"]} /></a>
                {isHovered && (
                  <>
                    <a>
                      <div className="home-icons" 
                        onClick={() => {
                          addCart(cookies.session, books["id"]);
                          window.confirm("This book has been added to your cart.");
                      }}>
                        <ShoppingCartOutlinedIcon />
                      </div>
                    </a>
                  </>
                )}
                <span className="home-bookname">{books["title"]}</span>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="home-bestseller">
        <span className="home-title">Popular on the Web</span>
        <div className="home-wrapper">
          <Slider {...settings1}>
            {sentiment != null && sentiment["result"].map((books, idx) => (
              <div 
              className={"home-slide1"} 
              onMouseEnter={() => setHovered(true)} 
              onMouseLeave={() => setHovered(false)}
              >
                <a href={"/product-detail/" + books["id"]}><img src={books["img"]} /></a>
                {isHovered && (
                  <>
                    <a>
                    <div className="home-icons" 
                        onClick={() => {
                          addCart(cookies.session, books["id"]);
                          window.confirm("This book has been added to your cart.");
                      }}>
                        <ShoppingCartOutlinedIcon />
                      </div>
                    </a>
                  </>
                )}
                <span className="home-bookname">{books["title"]}</span>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="home-bestseller">
        <span className="home-title">New Releases</span>
        <div className="home-wrapper">
          <Slider {...settings1}>
            {newReleases.map((books, idx) => (
              <div 
              className={"home-slide1"} 
              onMouseEnter={() => setHovered(true)} 
              onMouseLeave={() => setHovered(false)}
              >
                <a href={"/product-detail/" + books["id"]}><img src={books["img"]} /></a>
                {isHovered && (
                  <>
                    <a>
                    <div className="home-icons" 
                        onClick={() => {
                          addCart(cookies.session, books["id"]);
                          window.confirm("This book has been added to your cart.");
                      }}>
                        <ShoppingCartOutlinedIcon />
                      </div>
                    </a>
                  </>
                )}
                <span className="home-bookname">{books["title"]}</span>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="home-bestseller">
        <span className="home-title">Recommended for You</span>
        <div className="home-wrapper">
          <Slider {...settings1}>
            {recommend != null && recommend.map((books, idx) => (
              <div 
              className={"home-slide1"} 
              onMouseEnter={() => setHovered(true)} 
              onMouseLeave={() => setHovered(false)}
              >
                <a href={"/product-detail/" + books["book_id"]}><img src={books["img_url"]} /></a>
                {isHovered && (
                  <>
                    <a>
                    <div className="home-icons" 
                        onClick={() => {
                          addCart(cookies.session, books["book_id"]);
                          window.confirm("This book has been added to your cart.");
                      }}>
                        <ShoppingCartOutlinedIcon />
                      </div>
                    </a>
                  </>
                )}
                <span className="home-bookname">{books["book_name"]}</span>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="home-bestseller">
      </div>
    </div>
  )
}

export default Home;