import { ReqStatus } from "./types";

export const dishCategories = ["entree", "main", "desert"];

export const initialReqState: ReqStatus = {
  isLoading: false,
  isSuccess: false,
  errors: { status: null, message: "" },
};

export const initialAddOrUpdateRecipeErrors = {
  titleErrorMessage: "",
  imgErrorMessage: "",
  categoryErrorMessage: "",
  ingredientsErrorMessage: "",
  instructionsErrorMessage: "",
};

let BASE_API_URL = "http://localhost:5000";

const BASE_PROD_API_URL = "https://recipe-reader-server.herokuapp.com";

// if (process.env.REACT_APP_MY_ENV === "production") {
// }

BASE_API_URL = BASE_PROD_API_URL;

const socialAuthURL = "/auth";
const recipesURL = "/recipes";

export const socialAuthEndpoint = `${BASE_API_URL}${socialAuthURL}`;

export const recipesEndpoint = `${BASE_API_URL}${recipesURL}`;

// AUTH URLS
export const socialAuthGoogleURL = `${socialAuthEndpoint}/google`;

export const socialAuthFacebookURL = `${socialAuthEndpoint}/facebook`;

export const getUserURL = `${BASE_API_URL}/getuser`;

export const logoutURL = `${BASE_API_URL}/logout`;

export const signupURL = `${BASE_API_URL}/signup`;

export const loginURL = `${BASE_API_URL}/login`;

export const forgotPasswordURL = `${BASE_API_URL}/forgotpassword`;

export const resetPasswordTokenURL = (token: string) =>
  `${BASE_API_URL}/resetpassword/${token}`;

// RECIPE URLS
export const getAllRecipesURL = `${recipesEndpoint}/all`;

export const addRecipeURL = `${recipesEndpoint}/add`;

export const updateRecipeURL = (id: string) =>
  `${recipesEndpoint}/update/${id}`;

export const deleteRecipeURL = (id: string) =>
  `${recipesEndpoint}/delete/${id}`;
