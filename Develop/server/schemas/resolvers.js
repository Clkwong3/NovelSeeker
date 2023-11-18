// Import necessary modules
const { User } = require("../models");
const { signToken } = require("../utils/auth");

// Define GraphQL resolvers for Query and Mutation
const resolvers = {
  Query: {
    // Resolver for the 'getSingleUser' query to retrieve a user by ID
    getSingleUser: async (_parent, { id, username }) => {
      // Find a user by ID or username
      const foundUser = await User.findOne({
        $or: [{ _id: id }, { username: username }],
      });

      // Throw an error if user is not found
      if (!foundUser) {
        throw new Error("User not found");
      }

      // Return the found user
      return foundUser;
    },

    // Resolver for the 'me' query to retrieve the currently authenticated user
    me: async (_, __, { user }) => {
      // If there's a user in the context, return it
      if (user) {
        return user;
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
        throw new Error("Something is wrong!");
      }

      // Generate a token for the new user
      const token = signToken(user);

      // Return the token and user information
      return { token, user };
    },

    // Resolver for the 'login' mutation to authenticate and generate a token for a user
    login: async (_, { username, email}) => {
      // Find a user by username or email
      const user = await User.findOne({
        $or: [{ username: username.username }, { email: email.email }],
      });

      // Throw an error if user is not found
      if (!user) {
        throw new Error("Can't find this user");
      }

      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(body.password);

      // Throw an error if the password is incorrect
      if (!correctPw) {
        throw new Error("Wrong password!");
      }

      // Generate a token for the authenticated user
      const token = signToken(user);

      // Return the token and user information
      return { token, user };
    },

    // Resolver for the 'saveBook' mutation to add a book to a user's saved books
    saveBook: async ({ user, body }) => {
      // Add the book to the user's saved books and return the updated user
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },

    // Resolver for the 'deleteBook' mutation to remove a book from a user's saved books
    deleteBook: async ({ user, params }) => {
      // Remove the specified book from the user's saved books and return the updated user
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );

      // Throw an error if the user is not found
      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }

      // Return the updated user
      return updatedUser;
    },
  },
};

// Export the resolvers for use in the Apollo Server
module.exports = resolvers;
