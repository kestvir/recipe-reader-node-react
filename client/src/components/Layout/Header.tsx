import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { State } from "../../utils/types";
import { logoutURL } from "../../utils/backendUrls";
import { logout as logoutAction } from "../../redux/store";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  const user = useSelector((state: State) => state.auth.userObj);
  const dispatch = useDispatch();
  const history = useHistory();

  const logout = async () => {
    try {
      const resp = await axios.get(logoutURL);
      if (resp.data === "success") {
        dispatch(logoutAction());
        history.push("/");
      }
    } catch (err) {
      console.error(err);
    }
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

            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">Recipes</a>

              <div className="navbar-dropdown">
                <a className="navbar-item">Manage recipes</a>
                <Link to="/recipes/add" className="navbar-item">
                  Add a recipe
                </Link>
              </div>
            </div>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {user.id.length ? (
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
