import React, { useState } from "react";
import { Link } from "react-router-dom";
import Meta from "../components/Meta";
import Button from "../components/Button";
import ModalVideo from "react-modal-video";
import i18n from '../i18n/i18n'

const HomeScreen = (props) => {
  return (
    <div className="hero-container">
      <video src="/videos/video-2.mp4" autoPlay loop muted />
      <h2 style={{fontSize:'4rem', color:'#fff'}}>{i18n.trs('homeHeader')}</h2>
      <p>{i18n.trs('homeHeader2')}</p>
      <div className="hero-btns">
        <Link to="/services">
          <Button
            className="btns"
            buttonStyle="btn--outline"
            buttonSize="btn--large"
          >
            {i18n.trs('homeBtn1')}
          </Button>
        </Link>
        <a target="_blank" href="https://www.youtube.com/watch?v=pj9cNnT7PJs">
          <Button
            className="btns"
            buttonStyle="btn--primary"
            buttonSize="btn--large"
          >
            {i18n.trs('homeBtn2')} <i className="far fa-play-circle" />
          </Button>
        </a>
      </div>
    </div>
  );
};

export default HomeScreen;
