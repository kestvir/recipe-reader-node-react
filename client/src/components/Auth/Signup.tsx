import React, { useState } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import SocialAuthButtons from "./SocialAuthButtons";
import Input from "../UI/Input";
import { signupURL } from "../../shared/backendUrls";
import { getUser } from "../../shared/functions";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../../shared/type";

interface SignupProps {}

const initialFormState = { email: "", password: "", passwordVerify: "" };

const Signup: React.FC<SignupProps> = ({}) => {
  const user = useSelector((state: IState) => state.auth.userObj);
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialFormState);
  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post(signupURL, {
        email: form.email,
        password: form.password,
      });
      if (res.data === "success") {
        getUser(dispatch);
        history.push("/");
      }
    } catch (err) {
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
          <h3 className="is-size-3 mb-1">
            <strong>Sign up</strong>
          </h3>
          <form onSubmit={handleSubmit}>
            <SocialAuthButtons isSignup={true} />
            <div className="field has-text-centered is-size-5">OR</div>
            <Input
              name="email"
              type="email"
              label="Email"
              handleChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              label="Password"
              handleChange={handleChange}
            />
            <div className="field">
              <div className="control">
                <button
                  className="button is-primary has-text-centered is-fullwidth is-size-5"
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
  );
};

export default Signup;
