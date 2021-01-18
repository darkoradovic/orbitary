import React from "react";
import { Helmet } from "react-helmet";

const Meta = (props) => {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <meta name="keyword" content={props.keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome to MERN Shop",
  description: "We sell the best products",
  keywords: "electronics, buy, cheap electrtonics",
};

export default Meta;
