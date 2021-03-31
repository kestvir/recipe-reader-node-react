import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

interface InputProps {
  value: string;
  name: string;
  label: string;
  type: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
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
  const [hideErrStyles, setHideErrStyles] = useState(true);

  useEffect(() => {
    setHideErrStyles(!displayErrors);
  }, [displayErrors]);

  const changeValAndClearErrStyles = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleChange(e);
    setHideErrStyles(true);
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
            !!errorMessage && !hideErrStyles && "is-danger"
          }`}
          type={type}
          name={name}
          onChange={changeValAndClearErrStyles}
          required
        />
        <span className="icon is-small is-left">{leftIcon}</span>
      </div>
      {!!errorMessage && !hideErrStyles && (
        <p className="help is-danger is-size-5">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;
