import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Input from "../UI/Input";
import SocialAuthButtons from "./SocialAuthButtons";
import { loginURL } from "../../utils/backendUrls";
import { getUser } from "../../utils/functions";
import { IState } from "../../utils/types";

interface LoginProps {}

const initialFormState = { email: "", password: "" };

const Login: React.FC<LoginProps> = ({}) => {
  const user = useSelector((state: IState) => state.auth.userObj);

  const dispatch = useDispatch();

  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayErrors, setDisplayErrors] = useState(false);

  const history = useHistory();

  const removeError = () => {
    setError("");
  };

  const setLoginError = () => {
    setError("Invalid username or password.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setDisplayErrors(false);
      const res = await axios.post(loginURL, {
        email: form.email,
        password: form.password,
      });
      if (res.data === "success") {
        setLoading(false);
        removeError();
        getUser(dispatch);
        history.push("/");
      }
    } catch (err) {
      if (err.response.status === 401) {
        setLoginError();
      }
      setLoading(false);
      setDisplayErrors(true);
      console.error(err);
    }
  };

  if (user.id) {
    return <Redirect to="/" />;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="columns mb-0">
          <div className="column is-half is-offset-one-quarter box px-6 py-5">
            <h3 className="is-size-3 mb-1 has-text-centered">
              <strong>Log in</strong>
            </h3>
            <form onSubmit={handleSubmit}>
              <SocialAuthButtons isSignup={false} />
              <div className="field has-text-centered is-size-5">OR</div>
              <Input
                value={form.email}
                name="email"
                type="email"
                label="Email"
                errorMessage={error}
                handleChange={handleChange}
                displayErrors={displayErrors}
              />
              <Input
                value={form.password}
                name="password"
                type="password"
                label="Password"
                errorMessage={error}
                handleChange={handleChange}
                displayErrors={displayErrors}
              />
              <div className="field">
                <div className="control">
                  <button
                    className={`button is-primary has-text-centered is-fullwidth is-size-5 ${
                      loading && "is-loading"
                    }`}
                    type="submit"
                  >
                    <strong>Log in</strong>
                  </button>
                </div>
              </div>
              <div className="field">
                <div className="control has-text-centered is-size-5">
                  <Link to="/signup">Don't have an account? Sign up!</Link>
                </div>
              </div>
              <div className="field">
                <div className="control has-text-centered is-size-5">
                  <Link to="/forgotpassword">Forgot password?</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
