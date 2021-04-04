import { SerializedError } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  facebookId?: string;
  googleId?: string;
}

export interface AuthState {
  userObj: User;
}

export interface State {
  auth: AuthState;
}

export interface ValidationErrorData {
  msg: string;
  param: string;
  value?: string;
  location?: string;
}

export interface MultipleFieldsAuthErrors {
  emailErrorMessage: string;
  passwordErrorMessage: string;
  confirmPasswordErrorMessage: string;
}

export interface ResetPasswordErrors {
  passwordErrorMessage: string;
  confirmPasswordErrorMessage: string;
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

export interface RecipesError {
  status: number | null;
  statusText: string | null;
}

export interface RecipesState {
  recipes: Recipe[];
  activeRecipe: Recipe;
  status: string;
  error: RecipesError | SerializedError;
}

export interface ImgFile {
  name: string;
  file: string | ArrayBuffer | null | Blob;
}
