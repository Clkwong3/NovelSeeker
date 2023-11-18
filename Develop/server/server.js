// Import required modules
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");

// Import GraphQL schema, resolvers, and database connection
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

// Set the port for the API server
const PORT = process.env.PORT || 3001;

// Create an Express application
const app = express();

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Function to start the Apollo server
const startApolloServer = async () => {
  // Start the Apollo server
  await server.start();

  // Use middleware to parse JSON and URL-encoded data in the requests
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Use Apollo Server's expressMiddleware with context provided by authMiddleware
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  // Serve static files and set up a wildcard route for production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  // When the database connection is open, start listening on the specified port
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
