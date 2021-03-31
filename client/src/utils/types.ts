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
  value: string;
  msg: string;
  param: string;
  location: string;
}

export interface MultipleFieldsAuthErrors {
  emailErrorMessage?: string;
  passwordErrorMessage: string;
  confirmPasswordErrorMessage: string;
}

export interface ILoginError {
  isError: boolean;
  errorMessage?: string;
}
