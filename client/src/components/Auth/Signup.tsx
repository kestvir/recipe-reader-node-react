import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import SocialAuthButtons from "./SocialAuthButtons";
import Input from "../UI/Input";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { signup, resetReqState } from "../../redux/slices/authSlice";
import { State, MultipleAuthInputFieldFormErrors } from "../../shared/types";

interface SignupProps {}

const initialFormState = { email: "", password: "", confirmPassword: "" };

const Signup: React.FC<SignupProps> = ({}) => {
  const userId = useAppSelector((state: State) => state.auth.id);
  const { isLoading, isSuccess, errors } = useAppSelector(
    (state: State) => state.auth
  );

  const dispatch = useAppDispatch();
  const history = useHistory();

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (isSuccess) {
      history.push("/");
    }

    return () => {
      dispatch(resetReqState());
    };
  }, [isSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, confirmPassword } = form;
    dispatch(signup({ email, password, confirmPassword }));
  };

  let emailErrorMessage, passwordErrorMessage, confirmPasswordErrorMessage;

  const authErrorMessages = errors.message as MultipleAuthInputFieldFormErrors;
  if (errors.status === 422) {
    emailErrorMessage = authErrorMessages.emailErrorMessage;
    passwordErrorMessage = authErrorMessages.passwordErrorMessage;
    confirmPasswordErrorMessage = authErrorMessages.confirmPasswordErrorMessage;
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
