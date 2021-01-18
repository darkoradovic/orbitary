import React, { useState, useEffect, useRef } from "react";
import { Link, Route } from "react-router-dom";
import Button from "../components/Button";
import LoadingBar from "react-top-loading-bar";
import SearchBox from "./SearchBox";
import { PoweroffOutlined } from "@ant-design/icons";

import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userAction";

const Navbar = (props) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const ref = useRef(null);
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  useEffect(() => {
    showButton();
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
  };

  const handleClick = () => {
    setClick(!click);
  };

  const closeMobileMenu = () => {
    setClick(false);
  };

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
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
            <div>
              <Link
                to="/"
                className="navbar-logo"
                onClick={() => ref.current.complete()}
              >
                ORBITARY <i className="fas fa-meteor" />
              </Link>
            </div>
            <Route render={({ history }) => <SearchBox history={history} />} />
            <div className="menu-icon" onClick={handleClick}>
              <i className={click ? "fas fa-times" : "fas fa-bars"} />
            </div>
            <div>
              <ul className={click ? "nav-menu active" : "nav-menu"}>
                <li className="nav-item">
                  <Link
                    to="/"
                    className="nav-links"
                    onClick={(closeMobileMenu, () => ref.current.complete())}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/services"
                    className="nav-links"
                    onClick={(closeMobileMenu, () => ref.current.complete())}
                  >
                    Services
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/contact"
                    className="nav-links"
                    onClick={(closeMobileMenu, () => ref.current.complete())}
                  >
                    Contact
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="nav-links"
                    onClick={(closeMobileMenu, () => ref.current.complete())}
                  >
                    Log in
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className="nav-links-mobile"
                    onClick={(closeMobileMenu, () => ref.current.complete())}
                  >
                    Sign up
                  </Link>
                </li>
                <Link to="/register" onClick={() => ref.current.complete()}>
                  <li className="sign-item">
                    {button && (
                      <Button buttonStyle="btn--outline">SIGN UP</Button>
                    )}
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-logo">
              ORBITARY <i className="fas fa-meteor" />
            </Link>
            <Route render={({ history }) => <SearchBox history={history} />} />
            <div className="menu-icon" onClick={handleClick}>
              <i className={click ? "fas fa-times" : "fas fa-bars"} />
            </div>
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item">
                <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/services"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Services
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/chat"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Chat
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-links" onClick={logoutHandler}>
                  <PoweroffOutlined />
                </Link>
              </li>
              <Link
                to="/profile"
                style={{ color: "black", textDecoration: "none" }}
              >
                <li className="profile-link circle pulse">
                  {userInfo && userInfo.name ? userInfo.name.slice(0, 1) : ""}
                </li>
              </Link>
            </ul>
            {/*  {button && <Button buttonStyle="btn--outline">SIGN UP</Button>} */}
          </div>
        </nav>
      </React.Fragment>
    );
  }
};

export default withRouter(Navbar);
