// Import necessary modules
const { User } = require("../models");
const { signToken } = require("../utils/auth");

// Define GraphQL resolvers for Query and Mutation
const resolvers = {
  Query: {
    // Resolver for the 'getSingleUser' query to retrieve a user by ID or username
    getSingleUser: async (_, { id, username }) => {
      try {
        // Find a user by ID or username
        const foundUser = await User.findOne({
          $or: [
            { _id: id },
            { username: username },
          ],
        });
  
        // Throw an error if user is not found
        if (!foundUser) {
          throw new Error("User not found");
        }
  
        // Return the found user
        return foundUser;
      } catch (error) {
        console.error(error);
        throw new Error("Error fetching user");
      }
    },
  
    // Resolver for the 'me' query to retrieve the currently authenticated user
    me: async (_, __, { user }) => {
      try {
        // If there's a user in the context, return it
        if (user) {
          return user;
        } else {
          throw new Error("User not authenticated");
        }
      } catch (error) {
        console.error(error);
        throw new Error("Error fetching authenticated user");
      }
    },
  },
  

  Mutation: {
    // Resolver for the 'createUser' mutation to create a new user
    createUser: async ({ body }) => {
      // Create a new user
      const user = await User.create(body);

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
    login: async ({ body }) => {
      // Find a user by username or email
      const user = await User.findOne({
        $or: [{ username: body.username }, { email: body.email }],
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
      try {
        // Add the book to the user's saved books and return the updated user
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        // Log and throw an error if saving the book fails
        console.error(err);
        throw new Error("Failed to save the book.");
      }
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
