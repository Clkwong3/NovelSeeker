// Import necessary dependencies and components from libraries
import React, { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";

// Import necessary functionality from Apollo Client for mutations
import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../utils/mutations";

// Import authentication utility from custom Auth module
import Auth from "../utils/auth";

// Import utility functions for Google Books API and local storage
import { searchGoogleBooks } from "../utils/API";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";

// Functional component for searching and saving books
const SearchBooks = () => {
  // State to hold returned Google API data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // State to hold search input data
  const [searchInput, setSearchInput] = useState("");
  // State to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // UseMutation hook for the SAVE_BOOK mutation from Apollo Client
  const [saveBook, { error }] = useMutation(SAVE_BOOK);

  // useEffect to save `savedBookIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // Method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if search input is empty
    if (!searchInput) {
      return false;
    }

    try {
      // Search Google Books API
      const response = await searchGoogleBooks(searchInput);

      // Check if the API response is successful
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      // Extract relevant data from the Google Books API response and map it to the required format
      const { items } = await response.json();

      // Map each book item from the API response to the desired format
      const bookData = items.map((book) => ({
        // Extract the unique book ID
        bookId: book.id,

        // Extract authors; set to ["No author to display"] if not available
        authors: book.volumeInfo.authors || ["No author to display"],

        // Extract the book title
        title: book.volumeInfo.title,

        // Extract the book description
        description: book.volumeInfo.description,

        // Extract the book thumbnail image URL; set to an empty string if not available
        image: book.volumeInfo.imageLinks?.thumbnail || "",
      }));

      // Update the state with the searched book data and reset the search input
      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // Find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // Get authentication token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    // Check if the token is available
    if (!token) {
      return false;
    }

    try {
      // Save the book to the database using the SAVE_BOOK mutation
      const { data } = await saveBook({
        variables: { bookInput: { ...bookToSave } },
      });

      // If the book is successfully saved, update the saved book ids in the state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  // JSX rendering for the search and display of books
  return (
    <>
      {/* Search Form */}
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      {/* Display Search Results */}
      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a book to begin"}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
                  {/* Display Book Cover */}
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}

                  {/* Display Book Information */}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>

                    {/* Save Book Button */}
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId)}
                      >
                        {savedBookIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        )
                          ? "This book has already been saved!"
                          : "Save this Book!"}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
