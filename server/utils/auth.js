// Import necessary modules
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

// Set the expiration time for JWT (JSON Web Token)
const expiration = "2h";

// Use dotenv to load the secret from the .env file
require('dotenv').config();

// Extract the secret key from the environment variables
const secret = process.env.SECRET_KEY;

// Export an AuthenticationError instance with specific details for GraphQL
module.exports = {
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),

  // Middleware function to handle user authentication
  authMiddleware: function ({ req }) {
    // Extract the token from different parts of the request
    let token = req.body.token || req.query.token || req.headers.authorization;

    // Remove "Bearer " prefix from the token if present
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // If no token is found, return the request object as is
    if (!token) {
      return req;
    }

    try {
      // Verify the token using the secret key and set user data in the request
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      // Log an error message if the token is invalid
      console.log("Invalid token");
    }

    // Return the modified request object
    return req;
  },

  // Function to sign a JWT token with user information
  signToken: function ({ email, username, _id }) {
    // Create a payload with user information
    const payload = { email, username, _id };

    // Sign the token with the payload, secret key, and expiration time
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
