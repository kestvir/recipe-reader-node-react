import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Redirect } from "react-router-dom";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Input from "../UI/Input";
import { checkResetPasswordToken } from "../../shared/backendUrls";
import {
  IState,
  IMultipleFieldsAuthErrors,
  IValidationErrorData,
} from "../../shared/types";

interface ResetPasswordProps {}

interface IParams {
  token: string;
}

const initialFormState = { password: "", confirmPassword: "" };

const initialErrorState = {
  passwordErrorMessage: "",
  confirmPasswordErrorMessage: "",
};

const ResetPassword: React.FC<ResetPasswordProps> = ({}) => {
  const user = useSelector((state: IState) => state.auth.userObj);
  const params: IParams = useParams();
  const history = useHistory();

  const [isTokenValid, setIsTokenValid] = useState(true);
  const [errors, setErrors] = useState<IMultipleFieldsAuthErrors>(
    initialErrorState
  );
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(checkResetPasswordToken(params.token));
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const removeErrors = () => {
    setErrors({ ...initialErrorState });
  };

  const setResetPasswordErrors = (error: AxiosError) => {
    let errorsData = { ...initialErrorState };
    if (error.response) {
      error.response.data.data.forEach((errorObj: IValidationErrorData) => {
        if (errorObj.param === "password") {
          errorsData.passwordErrorMessage = errorObj.msg;
        } else if (errorObj.param === "confirmPassword") {
          errorsData.confirmPasswordErrorMessage = errorObj.msg;
        } else return;
      });
    }
    setErrors(errorsData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(checkResetPasswordToken(params.token), {
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      if (res.data === "success") {
        setLoading(false);
        removeErrors();
        setIsPasswordReset(true);
        setTimeout(() => {
          history.push("/login");
        }, 1700);
      }
    } catch (err) {
      if (err.response.status === 401) {
        setIsTokenValid(false);
        setTimeout(() => {
          history.push("/");
        }, 1700);
      } else if (err.response.status === 422) {
        setResetPasswordErrors(err);
      }
      setLoading(false);
      console.log(err);
    }
  };

  if (initialLoading)
    return (
      <progress
        className="progress is-small is-primary has-text-centered"
        max="100"
        style={{ width: "800px", margin: "0 auto" }}
      />
    );

  if (user.id) {
    return <Redirect to="/" />;
  }

  if (!isTokenValid) {
    return (
      <div className="columns is-centered">
        <div className="column is-narrow">
          <div className="notification is-danger has-text-centered is-size-5">
            <strong>
              Password reset token in invalid or has been expired.
            </strong>
          </div>
        </div>
      </div>
    );
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
              {isPasswordReset && (
                <div className="field">
                  <div className="control">
                    <div className="notification has-text-centered is-size-5">
                      <strong>Password successfully reset!</strong>
                    </div>
                  </div>
                </div>
              )}
              <Input
                name="password"
                type="password"
                label="New Password"
                isError={!!errors.passwordErrorMessage}
                errorMessage={errors.passwordErrorMessage}
                removeError={removeErrors}
                handleChange={handleChange}
              />
              <Input
                name="confirmPassword"
                type="password"
                label="Confirm New Password"
                isError={!!errors.confirmPasswordErrorMessage}
                errorMessage={errors.confirmPasswordErrorMessage}
                removeError={removeErrors}
                handleChange={handleChange}
              />
              <div className="field">
                <div className="control">
                  <button
                    className={`button is-primary has-text-centered is-fullwidth is-size-5 ${
                      loading && "is-loading"
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