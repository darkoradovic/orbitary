import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(keyword);
    if (keyword.trim()) {
      history.push(`/services/search/${keyword}`);
    } else {
      history.push("/");
    }
  };

  return (
    <form onSubmit={submitHandler} className="form-search">
      <div className="search-container">
        <input
          className="search expandright"
          id="searchright"
          type="search"
          name="q"
          placeholder="Search Services..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <label className="button-search searchbutton" for="searchright">
          <span className="mglass">
            <i className="fas fa-search"></i>
          </span>
        </label>
      </div>
    </form>
  );
};

export default SearchBox;
