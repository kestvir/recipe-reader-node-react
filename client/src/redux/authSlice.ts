import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../utils/@types/types";

export const initialAuthState: User = {
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
    setUser: (state, { payload }: PayloadAction<{ userObj: User }>) => {
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

export default authSlice.reducer;
