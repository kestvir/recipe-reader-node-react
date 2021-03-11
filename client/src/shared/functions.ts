import {
  socialAuthGoogleURL,
  socialAuthFacebookURL,
  getUserURL,
} from "./backendUrls";
import axios from "axios";
import { initialAuthState, setUser, AppDispatch } from "../redux/store";

export const googleAuth = () => {
  window.open(socialAuthGoogleURL, "_self");
};

export const facebookAuth = () => {
  window.open(socialAuthFacebookURL, "_self");
};

export const getUser = async (dispatch: AppDispatch) => {
  try {
    const res = await axios.get(getUserURL);
    if (res.data) {
      dispatch(setUser({ userObj: res.data }));
    } else {
      dispatch(setUser({ userObj: initialAuthState }));
      localStorage.removeItem("recipeReaderUser");
    }
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};
