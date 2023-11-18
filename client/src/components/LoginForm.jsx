// Import necessary React components and hooks
import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";

// Import the useMutation hook and LOGIN_USER mutation
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";

// Import the Auth module for handling authentication
import Auth from "../utils/auth";

// Define the LoginForm functional component
const LoginForm = () => {
  // Set initial state for the form data, including email and password
  const [userFormData, setUserFormData] = useState({ email: "", password: "" });

  // Set state for form validation, initialized as false
  const [validated] = useState(false);

  // Set state for displaying an alert message, initialized as false
  const [showAlert, setShowAlert] = useState(false);

  // UseMutation hook for the LOGIN_USER mutation from Apollo Client
  const [login, { error }] = useMutation(LOGIN_USER);

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
      // Make a request to the server to log in the user using the LOGIN_USER mutation
      const { data } = await login({
        variables: { ...userFormData },
      });

      // Log in the user after a successful login
      Auth.login(data.login.token);
    } catch (err) {
      // Log and show an alert if there's an error during login
      console.error(err);
    }

    // Reset form data after submission
    setUserFormData({
      email: "",
      password: "",
    });
  };

  // Render the login form with Bootstrap components
  return (
    <>
      {/* Form component with validation and submission handling */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Show an alert if there's an error in the server response */}
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert>

        {/* Form fields for email and password */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"  // Changed type to 'email' for better validation
            placeholder="Your email"
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
          disabled={!(userFormData.email && userFormData.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

// Export the LoginForm component
export default LoginForm;
