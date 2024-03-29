import React from "react";
import GoogleIcon from "../../assets/icons/GoogleIcon";
import FacebookIcon from "../../assets/icons/FacebookIcon";
import {
  socialAuthGoogleURL,
  socialAuthFacebookURL,
} from "../../shared/constants";

interface SocialAuthButtonsProps {
  isSignup: boolean;
}

const googleAuth = () => {
  window.open(socialAuthGoogleURL, "_self");
};
const facebookAuth = () => {
  window.open(socialAuthFacebookURL, "_self");
};

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

      {/* Disable due to Facebook policy requirements */}
      {/* <div className="field">
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
      </div> */}
    </>
  );
};

export default SocialAuthButtons;
