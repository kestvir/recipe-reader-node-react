import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { State } from "../../shared/types";
import { logout as logoutAction } from "../../redux/slices/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  const userId = useAppSelector((state: State) => state.auth.id);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [isActive, setisActive] = useState(false);

  const logout = () => {
    dispatch(logoutAction());
    history.push("/");
  };

  return (
    <header>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <FontAwesomeIcon icon={faPizzaSlice} />
          </Link>
          <a
            onClick={() => {
              setisActive((prevState) => !prevState);
            }}
            role="button"
            className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          id="navbarBasicExample"
          className={`navbar-menu ${isActive ? "is-active" : ""}`}
        >
          <div className="navbar-start">
            <Link className="navbar-item" to="/">
              Home
            </Link>

            <Link className="navbar-item" to="/documentation">
              Documentation
            </Link>

            {userId && (
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Recipes</a>
                <div className="navbar-dropdown">
                  <Link to="/recipes" className="navbar-item">
                    Manage recipes
                  </Link>
                  <Link to="/recipes/add" className="navbar-item">
                    Add a recipe
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {userId ? (
                  <a className="button is-primary is-light" onClick={logout}>
                    <strong>Log out</strong>
                  </a>
                ) : (
                  <>
                    <Link to="/signup" className="button is-primary is-light">
                      <strong>Sign up</strong>
                    </Link>
                    <Link to="/login" className="button is-primary is-outlined">
                      <strong>Log in</strong>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
