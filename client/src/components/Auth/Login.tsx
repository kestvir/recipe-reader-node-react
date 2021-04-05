import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Input from "../UI/Input";
import SocialAuthButtons from "./SocialAuthButtons";
import { State } from "../../utils/@types/types";
import { login } from "../../redux/slices/loginSlice";

interface LoginProps {}

const initialFormState = { email: "", password: "" };

const Login: React.FC<LoginProps> = ({}) => {
  const userId = useSelector((state: State) => state.auth.id);
  const { isLoading, isSuccess, errors } = useSelector(
    (state: State) => state.login
  );
  const dispatch = useDispatch();

  const history = useHistory();

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (isSuccess) {
      history.push("/");
    }
  }, [isSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = form;
    dispatch(login({ email, password }));
  };

  let loginError;
  if (errors.status === 401 && typeof errors.message === "string") {
    loginError = errors.message;
  }

  if (userId) {
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
                errorMessage={loginError}
                handleChange={handleChange}
                displayErrors={!isLoading}
              />
              <Input
                value={form.password}
                name="password"
                type="password"
                label="Password"
                errorMessage={loginError}
                handleChange={handleChange}
                displayErrors={!isLoading}
              />
              <div className="field">
                <div className="control">
                  <button
                    className={`button is-primary has-text-centered is-fullwidth is-size-5 ${
                      isLoading && "is-loading"
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
