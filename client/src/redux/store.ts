import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import recipesReducer from "./slices/recipesSlice";
import signupReducer from "./slices/signupSlice";
import loginReducer from "./slices/loginSlice";
import forgotPasswordReducer from "./slices/forgotPasswordSlice";
import resetPasswordReducer from "./slices/resetPasswordSlice";

const reducer = {
  auth: authReducer,
  login: loginReducer,
  signup: signupReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  recipes: recipesReducer,
};

const store = configureStore({ reducer });

export type AppDispatch = typeof store.dispatch;

export default store;
