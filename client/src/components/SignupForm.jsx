// Import necessary React components and hooks
import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";

import Auth from "../utils/auth";

// Functional component for the signup form
const SignupForm = () => {
  // Set initial state for the form data, including username, email, and password
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Set state for form validation, initialized as false
  const [validated] = useState(false);

  // Set state for displaying an alert message, initialized as false
  const [showAlert, setShowAlert] = useState(false);

  // UseMutation hook for the ADD_USER mutation from Apollo Client
  const [addUser, { error }] = useMutation(ADD_USER);

  // UseEffect to handle errors and show/hide the alert accordingly
  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);

  // Event handler for input changes in the form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Update the form data state based on the user's input
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Event handler for form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if the form is valid according to react-bootstrap validation
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Make a request to the server to add a new user using the AddUser mutation
      // Destructure the 'data' property from the response
      const { data } = await addUser({
        // Pass the user form data as variables to the AddUser mutation
        variables: { ...userFormData },
      });

      // Log in the user after a successful signup
      Auth.login(data.addUser.token);
    } catch (err) {
      // Log and show an alert if there's an error during signup
      console.error(err);
    }

    // Reset form data after submission
    setUserFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  // Render the signup form with Bootstrap components
  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Show an alert if there's an error in the server response */}
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your signup! Please try again.
        </Alert>

        {/* Form fields for username, email, and password */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">
            Username is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>

        {/* Submit button */}
        <Button
          disabled={
            !(
              userFormData.username &&
              userFormData.email &&
              userFormData.password
            )
          }
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

// Export the SignupForm component
export default SignupForm;
