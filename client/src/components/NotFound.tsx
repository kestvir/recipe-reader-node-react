import React from "react";
import { Link } from "react-router-dom";

interface NotFoundProps {}

const NotFound: React.FC<NotFoundProps> = ({}) => {
  return (
    <section className="section is-flex is-flex-direction-column is-justify-content-center is-align-content-center">
      <h3 className="is-size-3 mb-2">Page not found.</h3>
      <button className="button is-primary has-text-weight-semibold">
        <Link className="has-text-white	" to="/">
          Go Home
        </Link>
      </button>
    </section>
  );
};

export default NotFound;
