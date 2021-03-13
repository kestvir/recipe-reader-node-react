import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Input from "../UI/Input";
import SocialAuthButtons from "./SocialAuthButtons";
import { loginURL } from "../../shared/backendUrls";
import { getUser } from "../../shared/functions";
import { IState } from "../../shared/types";

interface LoginProps {}

const initialFormState = { email: "", password: "" };

const Login: React.FC<LoginProps> = ({}) => {
  const user = useSelector((state: IState) => state.auth.userObj);
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
      console.error(err);
    }
  };

  if (user.id) {
    return <Redirect to="/" />;
  }

  return (
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
              name="email"
              type="email"
              label="Email"
              isError={!!error}
              removeError={removeError}
              handleChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              label="Password"
              isError={!!error}
              removeError={removeError}
              handleChange={handleChange}
            />
            {error && (
              <div className="field">
                <div className="control  has-text-centered">
                  <span className="is-size-5 has-text-danger">{error}</span>
                </div>
              </div>
            )}
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
  );
};

export default Login;
