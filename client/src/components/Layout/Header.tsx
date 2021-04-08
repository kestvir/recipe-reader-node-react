import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { State } from "../../shared/types";
import { logout as logoutAction } from "../../redux/slices/authSlice";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  const userId = useAppSelector((state: State) => state.auth.id);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const logout = () => {
    dispatch(logoutAction());
    history.push("/");
  };

  return (
    <header>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <img
              src="https://bulma.io/images/bulma-logo.png"
              width="112"
              height="28"
            />
          </Link>

          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-item" to="/">
              Home
            </Link>

            <a className="navbar-item">Documentation</a>

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
                  <a className="button is-primary" onClick={logout}>
                    <strong>Log out</strong>
                  </a>
                ) : (
                  <>
                    <Link to="/signup" className="button is-primary">
                      <strong>Sign up</strong>
                    </Link>
                    <Link to="/login" className="button is-light">
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
