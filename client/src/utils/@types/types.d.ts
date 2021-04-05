import { SerializedError } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  facebookId?: string;
  googleId?: string;
}

export type AsyncRequestErrorsMessage =
  | string
  | SignupAuthErrors
  | AddOrUpdateRecipeErrors
  | ResetPasswordErrors
  | BasicError
  | SerializedError;

export interface AsyncRequestErrors {
  status: number;
  message: AsyncRequestErrorsMessage;
}

export interface AuthState extends BasicAsyncState {
  id: string;
  email: string;
  facebookId?: string | undefined;
  googleId?: string | undefined;
}

export interface MultipleInputFieldFormErrors {
  emailErrorMessage?: string;
  passwordErrorMessage: string;
  confirmPasswordErrorMessage: string;
}

export interface BasicAsyncState {
  isLoading: boolean;
  isSuccess: boolean;
  errors: CustomAuthError;
}

export interface CustomAuthError {
  status: number | null;
  message: string | MultipleInputFieldFormErrors;
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

export interface AddOrUpdateRecipeErrors {
  titleErrorMessage: string;
  categoryErrorMessage: string;
  imgErrorMessage: string;
  ingredientsErrorMessage: string;
  instructionsErrorMessage: string;
}

export interface Recipe {
  title: string;
  category: string;
  img: Blob | string;
  ingredients: string;
  instructions: string;
}

export interface RecipesState {
  recipes: Recipe[];
  activeRecipe: Recipe;
}

export interface ImgFile {
  name: string;
  file: string | ArrayBuffer | null | Blob;
}
