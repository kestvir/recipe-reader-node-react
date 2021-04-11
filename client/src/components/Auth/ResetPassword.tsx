import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetPassword, resetReqState } from "../../redux/slices/authSlice";
import Input from "../UI/Input";
import { resetPasswordTokenURL } from "../../shared/constants";
import { State, MultipleAuthInputFieldFormErrors } from "../../shared/types";
import ProgressBar from "../UI/Progressbar";
import SuccessMessage from "../UI/SuccessMessage";

interface ResetPasswordProps {}

interface Params {
  token: string;
}
const initialFormState = { password: "", confirmPassword: "" };

const ResetPassword: React.FC<ResetPasswordProps> = ({}) => {
  const userId = useSelector((state: State) => state.auth.id);
  const { isLoading, isSuccess, errors } = useSelector(
    (state: State) => state.auth
  );
  const dispatch = useDispatch();

  const params: Params = useParams();
  const history = useHistory();

  const [isTokenValid, setIsTokenValid] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(resetPasswordTokenURL(params.token));
        if (res.data === "success") {
          setInitialLoading(false);
          setIsTokenValid(true);
        }
      } catch (err) {
        if (err.response.status === 401) {
          setInitialLoading(false);
          setIsTokenValid(false);
          setTimeout(() => {
            history.push("/");
          }, 1700);
        }
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        history.push("/login");
      }, 1700);
    }
    if (errors.status === 401) {
      setIsTokenValid(false);
      setTimeout(() => {
        history.push("/");
      }, 1700);
    }
  }, [isSuccess, errors]);

  useEffect(() => {
    return () => {
      dispatch(resetReqState());
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { password, confirmPassword } = form;
    dispatch(resetPassword({ password, confirmPassword, token: params.token }));
  };

  let passwordErrorMessage, confirmPasswordErrorMessage;

  const authErrorMessages = errors.message as MultipleAuthInputFieldFormErrors;
  if (errors.status === 422) {
    passwordErrorMessage = authErrorMessages.passwordErrorMessage;
    confirmPasswordErrorMessage = authErrorMessages.confirmPasswordErrorMessage;
  }

  if (initialLoading) return <ProgressBar />;

  if (!isTokenValid) {
    return (
      <section className="is-justify-content-center	">
        <div className="columns is-centered">
          <div className="column is-narrow">
            <div className="notification is-danger has-text-centered is-size-5">
              <strong>
                Password reset token in invalid or has been expired.
              </strong>
            </div>
          </div>
        </div>
      </section>
    );
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
              <strong>Forgot password</strong>
            </h3>
            <form onSubmit={handleSubmit}>
              {isSuccess && (
                <SuccessMessage successText="Password successfully reset!" />
              )}
              <Input
                value={form.password}
                name="password"
                type="password"
                label="New Password"
                errorMessage={passwordErrorMessage}
                handleChange={handleChange}
                displayErrors={!isLoading}
              />
              <Input
                value={form.confirmPassword}
                name="confirmPassword"
                type="password"
                label="Confirm New Password"
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
                    <strong>Submit</strong>
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

export default ResetPassword;
