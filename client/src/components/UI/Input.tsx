import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

interface InputProps {
  name: string;
  label: string;
  type: string;
  isError?: boolean;
  errorMessage?: string;
  removeError?: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  type,
  isError,
  errorMessage,
  removeError,
  handleChange,
}) => {
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
      <div className="control has-icons-left">
        <input
          className={`input is-medium ${isError && "is-danger"}`}
          type={type}
          name={name}
          onChange={handleChange}
          onFocus={removeError}
          required
        />
        <span className="icon is-small is-left">{leftIcon}</span>
      </div>
      {!!errorMessage && <p className="help is-danger">{errorMessage}</p>}
    </div>
  );
};

export default Input;
