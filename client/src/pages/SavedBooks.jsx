// Import necessary React Bootstrap components
import { Container, Card, Button, Row, Col } from "react-bootstrap";

// Import necessary functionality from Apollo Client for queries and mutations
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { DELETE_BOOK } from "../utils/mutations";

// Import authentication utility from custom Auth module
import Auth from "../utils/auth";

// Import utility function for removing book ID from local storage
import { removeBookId } from "../utils/localStorage";

// Functional component for displaying saved books
const SavedBooks = () => {
  // UseQuery hook to fetch user data, including saved books
  const { loading, data } = useQuery(QUERY_ME);
  
  // UseMutation hook for the DELETE_BOOK mutation
  const [deleteBook, { error }] = useMutation(DELETE_BOOK);

  // Extract user data from the query response
  const userData = data?.me || {};

  // Function to handle deleting a saved book from the database
  const handleDeleteBook = async (bookId) => {
    // Get authentication token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    // Return if token is not available
    if (!token) {
      return false;
    }

    try {
      // Call the DELETE_BOOK mutation to delete the book from the database
      const { data } = await deleteBook({
        variables: { bookId },
      });

      // Upon success, remove the book's ID from local storage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // If data is still loading, display a loading message
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // Render the component with saved books
  return (
    <>
      {/* Header for saved books section */}
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      {/* Container for displaying saved books */}
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        {/* Display saved books in a responsive row of cards */}
        <Row>
          {userData.savedBooks?.map((book) => {
            return (
              <Col md="4">
                {/* Card for each saved book */}
                <Card key={book.bookId} border="dark">
                  {/* Display book cover image if available */}
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  {/* Card body with book details */}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {/* Button to delete the saved book */}
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
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

// Export the SavedBooks component
export default SavedBooks;
