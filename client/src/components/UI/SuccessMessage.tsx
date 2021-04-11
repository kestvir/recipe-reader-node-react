import React from "react";

interface SuccessMessageProps {
  successText: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ successText }) => {
  return (
    <div className="field">
      <div className="control">
        <div className="notification is-success is-light has-text-centered is-size-5">
          <strong>{successText}</strong>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
