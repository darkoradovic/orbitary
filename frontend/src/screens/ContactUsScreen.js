import React, { useState } from "react";
import mailImage from "../assets/img-01.png";
import Tilt from "react-tilt";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

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
        setSent("Your message has been sent.");
        setTimeout(() => {
          setSent("");
        }, 5000);
      })
      .catch(() => {
        setSent("Something went wrong. Try again later");
      });
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
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsScreen;
