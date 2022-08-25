import React, { useState, useEffect } from "react";
import { BookShelf } from "../components/BookShelf";
import { Link } from "react-router-dom";
import * as BooksAPI from "../BooksAPI";

export const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    BooksAPI.getAll().then((books) => {
      setBooks(books);
    });
  }, []);

  const upDateShelf = (book, shelf) => {
    const upDateBooks = books.map((e) => {
      if (e.id === book.id) {
        book.shelf = shelf;
        return book;
      }
      return e;
    });
    setBooks(upDateBooks);
    BooksAPI.update(book, shelf);
  };

  const currentlyReading = books.filter(
    (book) => book.shelf === "currentlyReading"
  );
  const wantToRead = books.filter((book) => book.shelf === "wantToRead");
  const read = books.filter((book) => book.shelf === "read");

  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          <BookShelf
            title="Currently Reading"
            books={currentlyReading}
            upDateShelf={upDateShelf}
          />
          <BookShelf
            title="want To Read"
            books={wantToRead}
            upDateShelf={upDateShelf}
          />
          <BookShelf title="Read" books={read} upDateShelf={upDateShelf} />
        </div>
      </div>
      <Link to="/search" className="open-search">
        Add a book
      </Link>
    </div>
  );
};
