import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = (props) => {
  return (
    props.pages > 1 && (
      <Pagination>
        {[...Array(props.pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !props.isAdmin
                ? props.keyword
                  ? `/services/search/${props.keyword}/page/${x + 1}`
                  : `/services/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
          >
            <Pagination.Item active={x + 1 === props.page}>
              {x + 1}
            </Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
