// Import necessary modules
const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

// Set the secret key for JWT and token expiration time
const secret = 'mysecretsshhhhh';
const expiration = '2h';

// Export module containing authentication middleware and token signing function
module.exports = {
  // Middleware to check and authenticate user based on JWT token
  authMiddleware: function (context) {
    // Extract the token from the request headers
    const token = context.req.headers.authorization;

    // Check if token is missing, throw an AuthenticationError if yes
    if (!token) {
      throw new AuthenticationError('You must be logged in!');
    }

    try {
      // Verify the token using the secret key and set user data in the context
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      context.user = data;
    } catch (err) {
      // Log and throw an AuthenticationError if token verification fails
      console.error('Invalid token', err);
      throw new AuthenticationError('Invalid token!');
    }
  },

  // Sign a JWT token with user information
  signToken: function ({ username, email, _id }) {
    // Create a payload with user data
    const payload = { username, email, _id };
    
    // Sign the payload using the secret key and set expiration time
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
