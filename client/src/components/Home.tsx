import React from "react";
import { useAppSelector } from "../redux/hooks";
import { State } from "../shared/types";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";

const Home: React.FC = ({}) => {
  const userId = useAppSelector((state: State) => state.auth.id);
  return (
    <section className="hero is-small">
      <div className="hero-body is-flex is-flex-direction-column is-justify-content-space-between is-align-content-space-between has-text-centered pb-0">
        <div className="is-flex is-flex-direction-column has-text-centered">
          <p className="title is-size-1 has-text-weight-bold">
            Make cooking faster and more enjoyable!
          </p>
          <div className="buttons are-medium is-align-self-center">
            <button className="button is-black">
              <Link className="has-text-white" to="/">
                How it works?
              </Link>
            </button>
            <button className="button is-primary">
              <Link
                className="has-text-white"
                to={`${userId ? "/recipes/add" : "/singup"}`}
              >
                {`${userId ? "Add a recipe" : "Join us!"} `}
              </Link>
            </button>
          </div>
        </div>
        <div id="hero-img">
          <img src={heroImg} alt="illiustration of a chef cooking" />
        </div>
      </div>
    </section>
  );
};

export default Home;
