export interface IMongoDBUser {
  googleId?: string;
  facebookId?: string;
  email: string;
  password?: string;
  __v: number;
  _id: string;
}

export interface IUserToSend {
  googleId?: string;
  facebookId?: string;
  email: string;
  id: string;
}
