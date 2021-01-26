import React, { useState } from "react";
import mailImage from "../assets/img-01.png";
import Tilt from "react-tilt";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUsScreen = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sent, setSent] = useState("");
  const [result, setResult] = useState(null);

  const sendEmail = (event) => {
    event.preventDefault();
    if ((state.email && state.name && state.subject && state.message) === "") {
      toast.error("All fields must be filled!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      axios
        .post("/api/contact", { ...state })
        .then((response) => {
          setResult(response.data);
          setState({
            name: "",
            email: "",
            subject: "",
            message: "",
          });

          setSent("");
          setTimeout(() => {
            setSent("");
          }, 5000);

          toast.success("Your message has been sent.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch(() => {
          toast.error("Something went wrong. Try again later", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <div className="bg-contact">
      <h1>Contact us</h1>
      <p className="message-out">{sent}</p>
      <div className="container-contact100">
        <div className="wrap-contact100">
          <Tilt
            className="Tilt"
            options={{ max: 25 }}
            style={{ height: 250, width: 250 }}
          >
            <div className="contact100-pic Tilt-inner">
              <img src={mailImage} alt="IMG" />
            </div>
          </Tilt>
        </div>
        <div className="contact-right">
          <Form onSubmit={sendEmail}>
            <Form.Group controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter name"
                value={state.name}
                onChange={onInputChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={state.email}
                onChange={onInputChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="subject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                placeholder="Enter subject"
                value={state.subject}
                onChange={onInputChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                type="text"
                name="message"
                placeholder="Enter message"
                as="textarea"
                rows="5"
                value={state.message}
                onChange={onInputChange}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary">
              Send
            </Button>
            <ToastContainer />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsScreen;
