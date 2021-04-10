import React from "react";
import { useAppSelector } from "../redux/hooks";
import { State } from "../shared/types";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";

const Home: React.FC = ({}) => {
  const userId = useAppSelector((state: State) => state.auth.id);
  return (
    <section className="hero is-small">
      <div className="hero-body is-flex is-flex-direction-column  has-text-centered">
        <div
          id="hero-text"
          className="is-flex is-flex-direction-column has-text-centered"
        >
          <p className="block title is-size-1 is-size-2-mobile has-text-weight-bold">
            Make cooking faster and more enjoyable!
          </p>
          <p className="block is-size-5">
            Store recipes, group them by categories and get voice assistance
            while cooking!
          </p>
          <div className="buttons are-medium is-align-self-center is-justify-content-center">
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
        <div
          id="hero-img-container"
          className="is-flex is-flex-grow-1	 is-align-items-flex-end is-justify-content-center"
        >
          <img src={heroImg} alt="illiustration of a chef cooking" />
        </div>
      </div>
    </section>
  );
};

export default Home;
