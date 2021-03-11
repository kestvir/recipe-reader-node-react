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
