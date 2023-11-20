# NovelSeeker

## Overview

NovelSeeker is an innovative web application designed to simplify and enhance the experience of book enthusiasts by providing a platform to search, save, and organize their favorite novels. Leveraging the power of GraphQL, the application seamlessly integrates with the Google Books API to offer an extensive database of books.

### Key Features

- **Effortless Book Search:** Easily explore a vast collection of books using the intuitive search functionality powered by Google Books API.

- **Personal Library Management:** Create and manage a personalized library by saving your favorite books with detailed information, including authors, descriptions, and cover images.

- **User Authentication:** Securely register and log in to NovelSeeker to access personalized features, such as saving and retrieving your book collection.

- **Responsive Design:** Enjoy a user-friendly experience across various devices, ensuring accessibility whether you're on a desktop, tablet, or smartphone.

### Purpose
NovelSeeker is crafted with the purpose of providing a centralized hub for book enthusiasts to discover, organize, and keep track of their favorite novels effortlessly. Whether you're an avid reader or just getting started, NovelSeeker simplifies the process of finding and cataloging books, making the literary journey enjoyable and organized. Explore, save, and rediscover the joy of reading with NovelSeeker.

## Table of Contents

- [Description](#description)
- [Tools](#tools)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Links](#links)
- [Credits](#credits)
- [Contributing](#contributing)
- [Report Issue](#report-issue)
- [License](#license)

 

## Tools

- **Node.js:** JavaScript runtime for server-side development.
- **npm (Node Package Manager):** Package manager for Node.js to manage project dependencies.
- **Git:** Version control system for tracking changes in the code.

[Top](#novelseeker) | [Table of Contents](#table-of-contents)

## Technology Stack

### Root Package.json

#### Project Commands/Scripts

- **start:** Run the server using `node server/server.js`.
- **develop:** Concurrently run server and client development environments.
- **install:** Install server and client dependencies.
- **build:** Build the client using `npm run build`.

#### Dev Dependencies

- **concurrently:** ^8.2.0
  - Tool for running multiple commands concurrently during development.

### Server Package.json

#### Project Commands/Scripts

- **start:** Run the server using `node server.js`.
- **watch:** Run the server using nodemon for automatic restarts.

#### Dependencies

- **@apollo/server:** ^4.9.5

  - Implements a GraphQL server for defining schemas and resolving queries.

- **apollo-server-express:** ^3.6.2

  - Integrates Apollo Server with Express for GraphQL with Express as the HTTP server.

- **bcrypt:** ^5.0.0

  - Library for hashing passwords, commonly used for secure password storage.

- **express:** ^4.17.2

  - Fast and minimalist webb framework for Node.js, simplifying building robust web applications.

- **graphql:** ^16.6.0

  - Query language and runtime for APIs, often used with Apollo Server for GraphQL.

- **jsonwebtoken:** ^8.5.1

  - Generates and verifies JSON Web Tokens (JWT) for user authentication and authorization.

- **mongoose:** ^7.0.2

  - Object Data Modeling (ODM) library for MongoDB and Node.js, providing schema-based data modeling.

#### Dev Dependencies

- **nodemon:** ^2.0.3

  - Utility that monitors changes in Node.js applications and automatically restarts the server during development.

### Client Package.json

#### Project Commands/Scripts

- **dev:** Run Vite for development.
- **build:** Build the client using Vite.
- **lint:** Run ESLint for linting.
- **preview:** Preview the client using Vite.

#### Dependencies

- **@apollo/client:** ^3.7.14

  - Client library for interacting with a GraphQL server, facilitating queries and mutations.

- **bootstrap:** ^5.2.3

  - Front-end framework for responsive and visually appealing designs.

- **graphql:** ^16.6.0

  - Query language and runtime for APIs, commonly used with Apollo Client for GraphQL.

- **jwt-decode:** ^3.1.2

  - Library for decoding JSON Web Tokens (JWT) on the client side, useful for authentication.

- **react:** ^18.2.0

  - JavaScript library for building user interfaces and managing application state.

- **react-bootstrap:** ^2.7.4

  - React implementation of the Bootstrap framework, offering pre-designed components.

- **react-dom:** ^18.2.0

  - Entry point for the React DOM library, enabling rendering React components in the browser.

- **react-router-dom:** ^6.11.2

  - Library for adding routing functionality to React applications.

#### Dev Dependencies

- **@types/react:** ^18.0.28

  - Type definitions for React, enhancing development with type information and autocompletion.

- **@types/react-dom:** ^18.0.11

  - Type definitions for React DOM, providing type information for React DOM-specific features.

- **@vitejs/plugin-react:** ^4.0.0

  - Vite plugin enabling React support, particularly useful for fast development with features like hot module replacement.

- **eslint:** ^8.38.0

  - Tool for identifying and fixing problems in JavaScript code, ensuring code quality and consistency.

- **eslint-plugin-react:** ^7.32.2

  - ESLint plugin for React, providing rules and configurations for best practices.

- **eslint-plugin-react-hooks:** ^4.6.0

  - ESLint plugin enforcing rules related to React Hooks usage.

- **eslint-plugin-react-refresh:** ^0.3.4

  - ESLint plugin related to React Refresh, providing rules for faster development.

- **vite:** ^4.3.2

  - Fast build tool for modern web development, particularly effective for React projects with features like lightning-fast hot module replacement.

[Top](#novelseeker) | [Table of Contents](#table-of-contents)

## Installation

### Prerequisites

Before proceeding with the installation, make sure to have the following prerequisites installed in your system:

1. **Node.js and npm:** Ensure that Node.js and npm are installed. Download and install them from Node.js [official website](https://nodejs.org/en).

2. **MongoDB:** This project uses MongoDB as the database, make sure to have MongoDB installed and running. Download MongoDB from the [official website](https://www.mongodb.com/try/download/community).

#### Step-by-Step Instructions

1. **Clone the Repository:**

   ```zsh
   git clone git@github.com:Clkwong3/NovelSeeker.git
   ```

2. **Install Dependencies:**

   ```
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure Database Connection:**

   - In the `server/config/connection.js` file, adjust the MongoDB connection URI as needed.

4. **Run the Project:**

   - Run the server side by executing the following command from the server directory:

     ```
     cd server
     npm start
     ```

   - Run the client side by executing the following command from the client directory:

     ```
     cd client
     npm run dev
     ```

   - Run the both sides concurrently using the following command from the root directory:
     ```
     npm run develop
     ```

[Top](#novelseeker) | [Table of Contents](#table-of-contents)

## Usage

Provide usage instructions and examples. How can someone use your project? Include code samples if necessary.

## Testing

Explain how to run tests or provide information on the testing process for your project.

## Links

Include any relevant links, such as the project's website, documentation, or live demo.

## Credits

Acknowledge any contributors, libraries, or resources you used in your project.

## Contributing

If you'd like to contribute to the project with code or other contributions, we welcome your participation. Provide instructions for how others can do so.

## Report Issue

If you'd like to report an issue or contribute to the project, provide instructions for how others can do so.

## License

Specify the project's license, if applicable.
