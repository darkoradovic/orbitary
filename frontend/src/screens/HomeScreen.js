import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import Meta from "../components/Meta";
import Button from "../components/Button";
import ModalVideo from "react-modal-video";

const HomeScreen = (props) => {
  return (
    <div className="hero-container">
      <video src="/videos/video-2.mp4" autoPlay loop muted />
      <h1>ADVENTURE AWAITS</h1>
      <p>What are you waiting for?</p>
      <div className="hero-btns">
        <Link to="/services">
          <Button
            className="btns"
            buttonStyle="btn--outline"
            buttonSize="btn--large"
          >
            GET STARTED
          </Button>
        </Link>
        <a target="_blank" href="https://www.youtube.com/watch?v=pj9cNnT7PJs">
          <Button
            className="btns"
            buttonStyle="btn--primary"
            buttonSize="btn--large"
          >
            WATCH TRAILER <i className="far fa-play-circle" />
          </Button>
        </a>
      </div>
    </div>
  );
};

export default HomeScreen;
