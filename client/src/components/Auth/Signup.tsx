import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import SocialAuthButtons from "./SocialAuthButtons";
import Input from "../UI/Input";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/slices/signupSlice";
import { State } from "../../utils/@types/types";

interface SignupProps {}

const initialFormState = { email: "", password: "", confirmPassword: "" };

const Signup: React.FC<SignupProps> = ({}) => {
  const userId = useSelector((state: State) => state.auth.id);
  const { isLoading, isSuccess, errors } = useSelector(
    (state: State) => state.signup
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
    const { email, password, confirmPassword } = form;
    dispatch(signup({ email, password, confirmPassword }));
  };

  let emailErrorMessage, passwordErrorMessage, confirmPasswordErrorMessage;

  if (errors.status === 422 && typeof errors.message !== "string") {
    emailErrorMessage = errors.message.emailErrorMessage;
    passwordErrorMessage = errors.message.passwordErrorMessage;
    confirmPasswordErrorMessage = errors.message.confirmPasswordErrorMessage;
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
              <strong>Sign up</strong>
            </h3>
            <form onSubmit={handleSubmit}>
              <SocialAuthButtons isSignup={true} />
              <div className="field has-text-centered is-size-5">OR</div>
              <Input
                value={form.email}
                name="email"
                type="email"
                label="Email"
                errorMessage={emailErrorMessage}
                handleChange={handleChange}
                displayErrors={!isLoading}
              />
              <Input
                value={form.password}
                name="password"
                type="password"
                label="Password"
                errorMessage={passwordErrorMessage}
                handleChange={handleChange}
                displayErrors={!isLoading}
              />
              <Input
                value={form.confirmPassword}
                name="confirmPassword"
                type="password"
                label="Confirm password"
                errorMessage={confirmPasswordErrorMessage}
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
                    <strong>Sign up</strong>
                  </button>
                </div>
              </div>
              <div className="field">
                <div className="control has-text-centered is-size-5">
                  <Link to="/login">Already have an account? Log in!</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
