import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

interface InputProps {
  name: string;
  label: string;
  type: string;
  errorText?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  type,
  errorText,
  handleChange,
}) => {
  let leftIcon: any;

  const setLeftIcon = () => {
    switch (name) {
      case "email":
        leftIcon = <FontAwesomeIcon icon={faEnvelope} />;
        break;
      case "password":
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
          className="input is-medium"
          type={type}
          name={name}
          onChange={handleChange}
          required
        />
        <span className="icon is-small is-left">{leftIcon}</span>
      </div>
    </div>
  );
};

export default Input;
