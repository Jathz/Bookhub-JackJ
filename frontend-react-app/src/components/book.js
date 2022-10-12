import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { useParams, Link } from 'react-router-dom';
import { apiCall } from './helper';
import './style.css'

function getBookDetails(bookId, setError) {
  return apiCall(`book/view?id=${bookId}`, "GET", null, setError);
}

function getChapters(bookId, setError) {
  return apiCall(`book/get_chapters`, "POST", bookId, setError);
}

function Book() {
  const [ numPages, setNumPages ] = useState(null);
  const [ bookInfo, setBookInfo ] = useState(null);
  const [ error, setError ] = useState(null);
  // index to iterate over the chapterList array
  // chapter to display the chapter number as index != chapter
  const [ index, setIndex ] = useState(0);
  const [ chapter, setChapter ] = useState(0);
  const [ getchapterList, setchapterList ] = useState(["test"]);
  const [ bookChapter, setbookChapter ] = useState(null);
  const { bookId } = useParams();

  function handleNext() {
    if (index <= getchapterList.length) {
      setIndex(index + 1);
    }
  }

  function handlePrev() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  // this handles the change in selection menu from the drop down
  // event.target.value is returned as a string
  // cast into a int using parseInt as base10
  function handleChange(event) {
    setIndex(parseInt(event.target.value, 10));
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // this hook is called whenever the chapter state is changed
  // getchapterList is included to make sure that when it is
  // being updated properly through setbookChapter since
  // getChapters function is asynchronous
  useEffect(() => {
    if (getchapterList[index]) {
      setbookChapter(getchapterList[index]["path"]);
      // similar with the comment above, make sure that
      // chapter is always properly updated
      if (!chapter) {
        setChapter(getchapterList[0]["chapter"]);
      }
      // set the chapter number based off the index
      setChapter(getchapterList[0]["chapter"] + index);
    }
  }, [index, getchapterList]);

  useEffect(() => {
    getBookDetails(bookId, setError).then(body => {
      setBookInfo(body.result);
    })

    getChapters({"id": bookId}, setError).then(body => {
      const array = body.result;
      // sort the returned array in ascending order by chapter number
      array.sort((a, b) => a.chapter - b.chapter);
      setchapterList(array);
    })
    // since getChapters() is asynchronous, these two states are not always
    // updated in time
    setbookChapter(getchapterList[index]["path"]);
    setChapter(getchapterList[0]["chapter"]);

  }, []);

  if (error) { // show error message on screen and don't show book
    return (<p>{error}</p>);
  } else if (bookInfo === null) {
      return (<p>Failed to retrieve book info</p>);
  } else if (getchapterList[index] === undefined) {
      return (<p>Failed to retrieve book</p>);
  }

  return (
    <div className="book-wrapper">
      <div className="book-top">
        <div className="book-title">{bookInfo.book.book_name + ":" + " Chapter " + chapter}</div>
          <div className="book-select-div">
            <select className="book-select" value={index} onChange={handleChange}>
              {getchapterList.map((chaps, idx) => (
                <option value={idx}>{"Chapter " + (getchapterList[0]["chapter"] + idx)}</option>
              ))}
            </select>
          </div>
          { (index > 0) &&
            <button className="book-prev" onClick={handlePrev}>Prev Chapter</button>
          }
          { (index < (getchapterList.length - 1)) &&
            <button className="book-next" onClick={handleNext}>Next Chapter</button>
          }
      </div>
      <div className="book-pdf-container">
        <Document
          file={bookChapter}
          options={{ workerSrc: "/pdf.worker.js" }}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      </div>
      <div className="book-bottom">
        <button className="book-prev" onClick={handlePrev}>Prev Chapter</button>
        <button className="book-next" onClick={handleNext}>Next Chapter</button>
      </div>
    </div>
  );
}

export default Book;