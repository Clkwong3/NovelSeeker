// Import necessary modules
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");

// Import GraphQL schema and database connection
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

// Set the port number for the server, defaulting to 3001 if not provided
const PORT = process.env.PORT || 3001;

// Create an Express application
const app = express();

// Create a new instance of Apollo Server with the GraphQL schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server
const startApolloServer = async () => {
  // Start the Apollo Server
  await server.start();

  // Middleware setup for handling URL-encoded and JSON requests
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Use Apollo Server middleware for handling GraphQL requests, with authentication context
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  // Serve static files and handle wildcard routes in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  // Once the database connection is open, start the Express server
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
