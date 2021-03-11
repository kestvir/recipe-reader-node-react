import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../shared/type";

// interface IAuthState {

// }

export const initialAuthState: IUser = {
  id: "",
  email: "",
  facebookId: "",
  googleId: "",
};

const loadCurrentUser = () => {
  const userStr = localStorage.getItem("recipeReaderUser");
  if (typeof userStr === "string") {
    return JSON.parse(userStr);
  } else return initialAuthState;
};

const authSlice = createSlice({
  name: "auth",
  initialState: { userObj: loadCurrentUser() },
  reducers: {
    setUser: (state, { payload }: PayloadAction<{ userObj: any }>) => {
      state.userObj = payload.userObj;
      localStorage.setItem("recipeReaderUser", JSON.stringify(payload.userObj));
    },
    logout: (state) => {
      state.userObj = initialAuthState;
      localStorage.removeItem("recipeReader");
    },
  },
});

export const { setUser, logout } = authSlice.actions;

const reducer = { auth: authSlice.reducer };

const store = configureStore({ reducer });

export type AppDispatch = typeof store.dispatch;

export default store;
