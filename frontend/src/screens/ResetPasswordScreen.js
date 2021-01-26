import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ResetPasswordScreen = () => {
  const [password, setPasword] = useState("");
  const [message, setMessage] = useState(false);
  const { token } = useParams();

  console.log(token);

  const submitHandler = (e) => {
      e.preventDefault()
      try {
        axios.post("/api/users/new-password", { password, token }).then((res) => {
            console.log(res.data)
          if (res.data.message === 'password updated success') {
            setMessage(true);
    
            toast.success("Password reset successfully!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
           
          } else {
            toast.error("Something went wrong. Try again later", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
          }
        });

        
      } catch (error) {
        console.log(error)
      }
    
  };

  return (
    <FormContainer>
      {message && (
        <p>
          You have successfully changed your password. Please go to{" "}
          <Link to="/login">login page</Link> to continue.
        </p>
      )}
      <p>Please enter new password.</p>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPasword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Send
        </Button>
      </Form>
      <ToastContainer />
    </FormContainer>
  );
};

export default ResetPasswordScreen;
