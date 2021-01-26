import React, { useState, useEffect, useRef } from "react";
import { Link, Route } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import LoadingBar from "react-top-loading-bar";
import SearchBox from "./SearchBox";
import { PoweroffOutlined } from "@ant-design/icons";

import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userAction";
import LanguageSelector from "./LanguageSelector/LanguageSelector";

const Navbar = (props) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const ref = useRef(null);
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    showButton();
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
  };

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  const showNav = () => {
    document.getElementsByClassName("navigation")[0].classList.toggle("active");
  };

  window.addEventListener("resize", showButton);

  if (!userInfo) {
    return (
      <React.Fragment>
        <LoadingBar
          color="#00FF00"
          ref={ref}
          loaderSpeed={1000}
          transitionTime={500}
          waitingTime={500}
        />
        <nav className="navbar">
          <div className="navbar-container">
            <div style={{ zIndex: "10" }}>
              <Link
                to="/"
                className="navbar-logo"
                onClick={() => ref.current.complete()}
              >
                ORBITARY <i className="fas fa-meteor" />
              </Link>
            </div>
            <div className="nav-right">
              <Route
                render={({ history }) => <SearchBox history={history} />}
              />

              <div>
                <div class="navigation" onClick={showNav}>
                  <div class="ham-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div class="links">
                    <div class="link">
                      <LanguageSelector
                        leftSideStyle={props.leftSideStyle}
                        rightSideStyle={props.rightSideStyle}
                        onMouseOver={props.onMouseOver}
                        onMouseLeave={props.onMouseLeave}
                      />
                    </div>
                    <div class="link">
                      <Link to="/" onClick={() => setOpen(!open)}>
                        Home
                      </Link>
                    </div>
                    <div class="link">
                      <Link to="/services" onClick={() => setOpen(!open)}>
                        Services
                      </Link>
                    </div>
                    <div class="link">
                      <Link to="/contact" onClick={() => setOpen(!open)}>
                        Contact
                      </Link>
                    </div>
                    <div class="link">
                      <Link to="/login" onClick={() => setOpen(!open)}>
                        Log in
                      </Link>
                    </div>
                    <div class="link">
                      <Link to="/register" onClick={() => setOpen(!open)}>
                        <Button buttonStyle="btn--outline">SIGN UP</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <LoadingBar
          color="#00FF00"
          ref={ref}
          loaderSpeed={1000}
          transitionTime={500}
          waitingTime={500}
        />
        <nav className="navbar">
          <div className="navbar-container">
            <div style={{ zIndex: "10" }}>
              <Link
                to="/"
                className="navbar-logo"
                onClick={() => ref.current.complete()}
              >
                ORBITARY <i className="fas fa-meteor" />
              </Link>
            </div>
            <div className="nav-right">
              <div>
                <Route
                  render={({ history }) => <SearchBox history={history} />}
                />
              </div>
              <div>
                <Link
                  to="/profile"
                  style={{ color: "black", textDecoration: "none" }}
                  onClick={() => setOpen(!open)}
                >
                  <li className="profile-link circle pulse">
                    {userInfo && userInfo.name ? userInfo.name.slice(0, 1) : ""}
                  </li>
                </Link>
              </div>
              <div>
                <div class="navigation" onClick={showNav}>
                  <div class="ham-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div class="links">
                    <div class="link">
                      <LanguageSelector
                        leftSideStyle={props.leftSideStyle}
                        rightSideStyle={props.rightSideStyle}
                        onMouseOver={props.onMouseOver}
                        onMouseLeave={props.onMouseLeave}
                      />
                    </div>
                    <div class="link">
                      <Link to="/" onClick={() => setOpen(!open)}>
                        Home
                      </Link>
                    </div>
                    <div class="link">
                      <Link to="/services" onClick={() => setOpen(!open)}>
                        Services
                      </Link>
                    </div>
                    <div class="link">
                      <Link to="/contact" onClick={() => setOpen(!open)}>
                        Contact
                      </Link>
                    </div>
                    <div class="link">
                      <Link to="/chat" onClick={() => setOpen(!open)}>
                        Chat
                      </Link>
                    </div>
                    <div class="link">
                      <Link className="off" onClick={logoutHandler}>
                        <PoweroffOutlined />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
};

export default withRouter(Navbar);

const NavWrap = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 80px;

  align-items: center;
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  .nav-left {
    display: flex;
    padding: 0;
  }

  .nav-right {
    display: flex;
    padding: 0 2rem;
  }

  .logo {
    opacity: ${({ open }) => (open ? "0" : "1")};
    height: 30px;
  }
`;
