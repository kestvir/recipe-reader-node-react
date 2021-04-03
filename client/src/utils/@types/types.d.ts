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

export interface ImgFile {
  name: string;
  file: string | ArrayBuffer | null | Blob;
}
