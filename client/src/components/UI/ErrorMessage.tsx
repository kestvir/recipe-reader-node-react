import React from "react";

interface ErrroMessageProps {
  message: string | undefined;
  hideErrorMessage: boolean;
}

const ErrroMessage: React.FC<ErrroMessageProps> = ({
  message,
  hideErrorMessage,
}) => {
  return (
    <>
      {!!message && !hideErrorMessage && (
        <p className="help is-danger is-size-5">{message}</p>
      )}
    </>
  );
};

export default ErrroMessage;
