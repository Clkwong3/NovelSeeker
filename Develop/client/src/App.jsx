// Importing necessary styles and libraries
import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";

// Construct the main GraphQL API endpoint
// This connects to the Apollo Server (sandbox in this case)
const httpLink = createHttpLink({
  uri: "/graphql", // The endpoint for GraphQL requests
});

// Construct request middleware to attach the JWT token to every request as an `authorization` header
// This is for authentication and decryption - utilizes Headers (Authorization)
const authLink = setContext((_, { headers }) => {
  // Retrieve the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // Return the headers to the context so that the httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", // Attach the token to the authorization header
    },
  };
});

// Create the Apollo Client, which manages GraphQL requests and state
const client = new ApolloClient({
  // Set up the client to execute the `authLink` middleware before making requests to the GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(), // Use an in-memory cache to store and manage data locally
});

// The main App component, wrapped in the ApolloProvider to make GraphQL available throughout the app
function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar /> {/* Render the Navbar component */}
      <Outlet /> {/* Render the Outlet component to handle nested routes */}
    </ApolloProvider>
  );
}

export default App;
