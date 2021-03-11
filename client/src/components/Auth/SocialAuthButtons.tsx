import React from "react";
import { googleAuth, facebookAuth } from "../../shared/functions";
import GoogleIcon from "../../assets/icons/GoogleIcon";
import FacebookIcon from "../../assets/icons/FacebookIcon";

interface SocialAuthButtonsProps {
  isSignup: boolean;
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ isSignup }) => {
  return (
    <>
      <div className="field">
        <div className="control">
          <button
            className="button is-medium is-fullwidth"
            onClick={googleAuth}
            type="button"
          >
            <span className="icon is-small mr-2">
              <GoogleIcon />
            </span>
            <span>
              {isSignup ? "Sign up with Google" : "Log in with Google"}
            </span>
          </button>
        </div>
      </div>

      <div className="field">
        <div className="control">
          <button
            className="button is-medium is-fullwidth"
            onClick={facebookAuth}
            type="button"
          >
            <span className="icon is-small">
              <FacebookIcon />
            </span>
            <span>
              {isSignup ? "Sign up with Facebook" : "Log in with Facebook"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SocialAuthButtons;
