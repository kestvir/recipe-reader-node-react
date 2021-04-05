import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../utils/@types/types";
import { getUserURL, logoutURL } from "../../utils/backendUrls";
import {
  convertToCustomErrObj,
  apiReducerBuilder,
} from "../../utils/functions";
import { CustomAuthError } from "../../utils/@types/types";
import { initialBasicAsyncState } from "../../utils/constants";

export const initialUserInfo: User = {
  id: "",
  email: "",
  facebookId: "",
  googleId: "",
};

const loadCurrentUser = () => {
  const userStr = localStorage.getItem("recipeReaderUser");
  if (typeof userStr === "string") {
    return JSON.parse(userStr);
  } else return initialUserInfo;
};

const userInfo = loadCurrentUser();

export const logout = createAsyncThunk<
  void,
  undefined,
  { rejectValue: CustomAuthError }
>("auth/logout", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(logoutURL);
    if (res.status === 200) {
      dispatch(clearUser());
    }
  } catch (err) {
    const { status, statusText } = err.response;
    const errorObj = convertToCustomErrObj(status, statusText);
    return rejectWithValue(errorObj);
  }
});

export const getUser = createAsyncThunk<
  void,
  undefined,
  { rejectValue: CustomAuthError }
>("auth/getUser", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(getUserURL);
    if (res.status === 200) {
      dispatch(setUser({ userObj: res.data }));
    } else {
      dispatch(clearUser());
      localStorage.removeItem("recipeReaderUser");
    }
  } catch (err) {
    console.error(err);
    const { status, statusText } = err.response;
    const errorObj = convertToCustomErrObj(status, statusText);
    return rejectWithValue(errorObj);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...userInfo,
    ...initialBasicAsyncState,
  },
  reducers: {
    setUser: (state, { payload }: PayloadAction<{ userObj: User }>) => {
      const { id, email, googleId, facebookId } = payload.userObj;
      state.id = id;
      state.email = email;
      if (googleId) state.googleId = googleId;
      if (facebookId) state.facebookId = facebookId;
      localStorage.setItem(
        "recipeReaderUser",
        JSON.stringify({ id, email, googleId, facebookId })
      );
    },
    clearUser: (state) => {
      state.id = "";
      state.email = "";
      state.googleId = "";
      state.facebookId = "";
      localStorage.removeItem("recipeReaderUser");
    },
  },
  extraReducers: (builder) => apiReducerBuilder(builder, getUser),
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
