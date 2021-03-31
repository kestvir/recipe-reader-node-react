import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import SocialAuthButtons from "./SocialAuthButtons";
import Input from "../UI/Input";
import { signupURL } from "../../utils/backendUrls";
import { getUser } from "../../utils/functions";
import { useDispatch, useSelector } from "react-redux";
import {
  IState,
  IMultipleFieldsAuthErrors,
  IValidationErrorData,
} from "../../utils/types";

interface SignupProps {}

const initialFormState = { email: "", password: "", confirmPassword: "" };
const initialErrorState = {
  emailErrorMessage: "",
  passwordErrorMessage: "",
  confirmPasswordErrorMessage: "",
};

const Signup: React.FC<SignupProps> = ({}) => {
  const user = useSelector((state: IState) => state.auth.userObj);
  const dispatch = useDispatch();

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<IMultipleFieldsAuthErrors>(
    initialErrorState
  );
  const [loading, setLoading] = useState(false);
  const [displayErrors, setDisplayErrors] = useState(false);

  const history = useHistory();

  const setSignupErrors = (error: AxiosError) => {
    let errorsData = { ...initialErrorState };
    if (error.response) {
      error.response.data.data.forEach((errorObj: IValidationErrorData) => {
        if (errorObj.param === "email") {
          errorsData.emailErrorMessage = errorObj.msg;
        } else if (errorObj.param === "password") {
          errorsData.passwordErrorMessage = errorObj.msg;
        } else if (errorObj.param === "confirmPassword") {
          errorsData.confirmPasswordErrorMessage = errorObj.msg;
        } else return;
      });
    }
    setErrors(errorsData);
  };

  const removeErrors = () => {
    setErrors({ ...initialErrorState });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setDisplayErrors(false);
      const res = await axios.post(signupURL, {
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      if (res.data === "success") {
        setLoading(false);
        removeErrors();
        getUser(dispatch);
        history.push("/");
      }
    } catch (err) {
      if (err.response.status === 422) {
        console.log(err.response);
        setSignupErrors(err);
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
                errorMessage={errors.emailErrorMessage}
                handleChange={handleChange}
                displayErrors={displayErrors}
              />
              <Input
                value={form.password}
                name="password"
                type="password"
                label="Password"
                errorMessage={errors.passwordErrorMessage}
                handleChange={handleChange}
                displayErrors={displayErrors}
              />
              <Input
                value={form.confirmPassword}
                name="confirmPassword"
                type="password"
                label="Confirm password"
                errorMessage={errors.confirmPasswordErrorMessage}
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
