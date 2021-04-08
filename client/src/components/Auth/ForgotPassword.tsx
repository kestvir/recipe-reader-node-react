import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import Input from "../UI/Input";
import { State } from "../../shared/types";
import { forgotPassword, resetReqState } from "../../redux/slices/authSlice";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const userId = useAppSelector((state: State) => state.auth.id);
  const { isLoading, isSuccess, errors } = useAppSelector(
    (state: State) => state.auth
  );

  const dispatch = useAppDispatch();

  const history = useHistory();

  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        history.push("/");
      }, 1500);
    }
    return () => {
      dispatch(resetReqState());
    };
  }, [isSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  if (userId) {
    return <Redirect to="/" />;
  }

  let sendEmailError;
  if (errors.status === 401 && typeof errors.message === "string") {
    sendEmailError = errors.message;
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
              {isSuccess && (
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
                errorMessage={sendEmailError}
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
