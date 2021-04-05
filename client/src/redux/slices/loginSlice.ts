import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CustomAuthError } from "../../utils/@types/types";
import { loginURL } from "../../utils/backendUrls";
import { getUser } from "./authSlice";
import { initialBasicAsyncState } from "../../utils/constants";
import {
  convertToCustomErrObj,
  apiReducerBuilder,
} from "../../utils/functions";

interface UserLoginData {
  email: string;
  password: string;
}

export const login = createAsyncThunk<
  void,
  UserLoginData,
  { rejectValue: CustomAuthError }
>("login/login", async (userLoginDataObj, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(loginURL, { ...userLoginDataObj });
    if (response.status === 200) {
      dispatch(getUser());
    }
  } catch (err) {
    console.error(err);
    const { status, statusText } = err.response;
    if (status === 401) {
      return rejectWithValue({
        status,
        message: "Invalid username or password.",
      });
    } else {
      const errorObj = convertToCustomErrObj(status, statusText);
      return rejectWithValue(errorObj);
    }
  }
});

const loginSlice = createSlice({
  name: "login",
  initialState: { ...initialBasicAsyncState },
  reducers: {},
  extraReducers: (builder) => apiReducerBuilder(builder, login),
});

export const {} = loginSlice.actions;

export default loginSlice.reducer;
