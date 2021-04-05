import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import ErrorMessage from "./ErrorMessage";

interface InputProps {
  value: string;
  name: string;
  label: string;
  type: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string | undefined;
  displayErrors?: boolean;
}

const Input: React.FC<InputProps> = ({
  value,
  name,
  label,
  type,
  displayErrors,
  handleChange,
  errorMessage,
}) => {
  const [hideErrorStyles, setHideErrorStyles] = useState(true);

  useEffect(() => {
    setHideErrorStyles(!displayErrors);
  }, [displayErrors]);

  const changeValAndClearErrStyles = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleChange(e);
    setHideErrorStyles(true);
  };

  let leftIcon;

  const setLeftIcon = () => {
    switch (name) {
      case "email":
        leftIcon = <FontAwesomeIcon icon={faEnvelope} />;
        break;
      case "password":
      case "confirmPassword":
        leftIcon = <FontAwesomeIcon icon={faLock} />;
        break;
      default:
        leftIcon = "";
    }
  };
  setLeftIcon();

  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className={`control ${leftIcon && "has-icons-left"}`}>
        <input
          value={value}
          className={`input is-medium ${
            !!errorMessage && !hideErrorStyles ? "is-danger" : ""
          }`}
          type={type}
          name={name}
          onChange={changeValAndClearErrStyles}
          required
        />
        {leftIcon && <span className="icon is-small is-left">{leftIcon}</span>}
      </div>
      <ErrorMessage message={errorMessage} hideErrorMessage={hideErrorStyles} />
    </div>
  );
};

export default Input;
