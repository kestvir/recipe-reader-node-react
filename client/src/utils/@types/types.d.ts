import { SerializedError } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  facebookId?: string;
  googleId?: string;
}

export interface AuthState extends BasicAsyncState {
  id: string;
  email: string;
  facebookId?: string | undefined;
  googleId?: string | undefined;
}

export interface MultipleAuthInputFieldFormErrors {
  emailErrorMessage?: string;
  passwordErrorMessage: string;
  confirmPasswordErrorMessage: string;
}

export interface BasicAsyncState {
  isLoading: boolean;
  isSuccess: boolean;
  errors: CustomAuthError | CustomRecipeRequestError;
}

export interface CustomAuthError {
  status: number | null;
  message: string | MultipleAuthInputFieldFormErrors;
}

export interface CustomRecipeRequestError {
  status: number | null;
  message: string | AddOrUpdateRecipeErrors;
}

export interface AddOrUpdateRecipeErrors {
  titleErrorMessage: string;
  categoryErrorMessage: string;
  imgErrorMessage: string;
  ingredientsErrorMessage: string;
  instructionsErrorMessage: string;
}

export interface RecipesState {
  recipes: Recipe[];
  activeRecipe: Recipe;
}

export interface State {
  auth: AuthState;
  login: BasicAsyncState;
  signup: BasicAsyncState;
  forgotPassword: BasicAsyncState;
  resetPassword: BasicAsyncState;
}

export interface ValidationErrorData {
  msg: string;
  param: string;
  value?: string;
  location?: string;
}

export interface Recipe {
  title: string;
  category: string;
  img: string | ArrayBuffer | null | Blob;
  ingredients: string;
  instructions: string;
}

export interface ImgFile {
  name: string;
  file: string | ArrayBuffer | null | Blob;
}
