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
  } catch (err) {
    console.error(err);
  }
};

export const convertBase64 = (file: any) => {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
