export interface IUser {
  id: string;
  email: string;
  facebookId?: string;
  googleId?: string;
}

export interface IAuthState {
  userObj: IUser;
}

export interface IState {
  auth: IAuthState;
}

export interface ISignupErrorData {
  value: string;
  msg: string;
  param: string;
  location: string;
}

export interface ISignupErrors {
  emailErrorMessage: string;
  passwordErrorMessage: string;
  confirmPasswordErrorMessage: string;
}

export interface ILoginError {
  isError: boolean;
  errorMessage?: string;
}
