import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "../BooksAPI";
import { Book } from "../components/Book";
import { useDebounce } from "use-debounce";

export const SearchPage = ({ books }) => {
  const [query, setQuery] = useState("");
  const [value] = useDebounce(query, 500);
  const [sbooks, setSbooks] = useState([]);
  const [mapIdBooks, setMapIdBooks] = useState(new Map());
  const [comboBooks, setComboBooks] = useState([]);

  useEffect(() => {
    BooksAPI.getAll().then((data) => {
      setMapIdBooks(createMapIdBooks(data));
    });
    let isFoucse = true;
    if (value) {
      BooksAPI.search(value).then((data) => {
        if (data.error) {
          setSbooks([]);
        } else {
          if (isFoucse) {
            setSbooks(data);
          }
        }
      });
    }
    return () => {
      isFoucse = false;
      setSbooks([]);
    };
  }, [value]);

  useEffect(() => {
    const combo = sbooks.map((book) => {
      if (mapIdBooks.has(book.id)) {
        return mapIdBooks.get(book.id);
      } else {
        return book;
      }
    });
    setComboBooks(combo);
  }, [sbooks,mapIdBooks]);

  const createMapIdBooks = (books) => {
    const map = new Map();
    books.map((book) => map.set(book.id, book));
    return map;
  };

  const upDateShelf = (book, shelf) => {
    const upDateBooks = sbooks.map((e) => {
      if (e.id === book.id) {
        book.shelf = shelf;
        return book;
      }
      return e;
    });
    setSbooks(upDateBooks);
    BooksAPI.update(book, shelf);
  };

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to="/" className="close-search">
          Close
        </Link>
        <div className="search-books-input-wrapper">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {console.log(sbooks)}
        </div>
      </div>
      <div className="search-books-results">
        {sbooks.length > 0 && (
          <div>
            <h3 style={{ textAlign: "center" }}>
              Search returned {sbooks.length} books{" "}
            </h3>
            <ol className="books-grid">
              {comboBooks.map((b) => (
                <li key={b.id}>
                  <Book book={b} books={books} upDateShelf={upDateShelf} />
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
