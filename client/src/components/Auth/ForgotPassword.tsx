import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Input from "../UI/Input";
import { forgotPasswordURL } from "../../utils/backendUrls";
import { IState } from "../../utils/types";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const user = useSelector((state: IState) => state.auth.userObj);
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [displayErrors, setDisplayErrors] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setDisplayErrors(false);
      const res = await axios.post(forgotPasswordURL, {
        email,
      });
      if (res.data === "Email sent successfully!") {
        setLoading(false);
        removeError();
        setIsEmailSent(true);
        setTimeout(() => {
          history.push("/");
        }, 1500);
      }
    } catch (err) {
      if (err.response.status === 401) {
        setError(err.response.data.message);
      }
      setLoading(false);
      setDisplayErrors(true);
      console.error(err);
    }
  };

  const removeError = () => {
    setError("");
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
              <strong>Forgot password</strong>
            </h3>
            <form onSubmit={handleSubmit}>
              {isEmailSent && (
                <div className="field">
                  <div className="control">
                    <div className="notification has-text-centered is-size-5">
                      <strong>Email sent successfully!</strong>
                    </div>
                  </div>
                </div>
              )}
              <Input
                value={email}
                name="email"
                type="email"
                label="Email"
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
                    <strong>Send Email</strong>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
