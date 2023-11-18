// Import necessary modules
const { User } = require("../models");
const { signToken } = require("../utils/auth");

// Define GraphQL resolvers for Query and Mutation
const resolvers = {
  Query: {
    // Resolver for the 'me' query to retrieve the currently authenticated user
    me: async (_, __, { user }) => {
      // If there's a user in the context, return user data
      if (user) {
        return await User.findById(user._id);
      } else {
        throw new Error("User not authenticated");
      }
    },
  },

  Mutation: {
    // Resolver for the 'addUser' mutation to create a new user
    addUser: async (_, { username, email, password }) => {
      // Create a new user
      const user = await User.create({ username, email, password });

      // Throw an error if user creation fails
      if (!user) {
        throw new Error("Failed to create user");
      }

      // Generate a token for the new user
      const token = signToken(user);

      // Return the token and user information
      return { token, user };
    },

    // Resolver for the 'login' mutation to authenticate and generate a token for a user
    login: async (_, { email, password }) => {
      // Find a user by email
      const user = await User.findOne({ email });

      // Throw an error if user is not found
      if (!user) {
        throw new Error("User not found");
      }

      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);

      // Throw an error if the password is incorrect
      if (!correctPw) {
        throw new Error("Incorrect password");
      }

      // Generate a token for the authenticated user
      const token = signToken(user);

      // Return the token and user information
      return { token, user };
    },

    // Resolver for the 'saveBook' mutation to add a book to a user's saved books
    saveBook: async (_, { bookInput }, { user }) => {
      // Add the book to the user's saved books and return the updated user
      const updatedUser = await User.findOneAndUpdate(
        // Find the user by their unique identifier (user._id)
        { _id: user._id },
        // Use $addToSet to add the book to the savedBooks array if not already present
        { $addToSet: { savedBooks: bookInput } },
        // Options for the update operation:
        // - Set { new: true } to return the modified user document
        // - Set { runValidators: true } to run validators defined in the user model
        { new: true, runValidators: true }
      );

      return updatedUser;
    },

    // Resolver for the 'deleteBook' mutation to remove a book from a user's saved books
    deleteBook: async (_, { bookId }, { user }) => {
      // Remove the specified book from the user's saved books and return the updated user
      const updatedUser = await User.findOneAndUpdate(
        // Find the user by their unique identifier (user._id)
        { _id: user._id },
        // Use $pull to remove the book with the specified bookId from the savedBooks array
        { $pull: { savedBooks: { bookId } } },
        // Options for the update operation:
        // - Set { new: true } to return the modified user document
        { new: true }
      );

      // Throw an error if the user is not found
      if (!updatedUser) {
        throw new Error("User not found");
      }

      // Return the updated user
      return updatedUser;
    },
  },
};

// Export the resolvers for use in the Apollo Server
module.exports = resolvers;
