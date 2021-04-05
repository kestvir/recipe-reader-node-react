import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  CustomAuthError,
  MultipleInputFieldFormErrors,
} from "../../utils/@types/types";
import { signupURL } from "../../utils/backendUrls";
import { getUser } from "./authSlice";
import { initialBasicAsyncState } from "../../utils/constants";
import {
  convertToCustomErrObj,
  apiReducerBuilder,
  setupMultipleErrors,
} from "../../utils/functions";

interface UserSignupData {
  email: string;
  password: string;
  confirmPassword: string;
}

const initialSignupErrors = {
  emailErrorMessage: "",
  passwordErrorMessage: "",
  confirmPasswordErrorMessage: "",
};

export const signup = createAsyncThunk<
  void,
  UserSignupData,
  { rejectValue: CustomAuthError }
>("signup/signup", async (userSingupDataObj, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(signupURL, { ...userSingupDataObj });
    if (response.status === 200) {
      dispatch(getUser());
    }
  } catch (err) {
    console.error(err);
    let errorObj: CustomAuthError;
    const { status, statusText } = err.response;
    if (status === 422) {
      const formattedErrors: MultipleInputFieldFormErrors = setupMultipleErrors(
        err,
        initialSignupErrors
      );
      errorObj = convertToCustomErrObj(status, formattedErrors);
      return rejectWithValue(errorObj);
    }
    errorObj = convertToCustomErrObj(status, statusText);
    return rejectWithValue(errorObj);
  }
});

const signupSlice = createSlice({
  name: "signup",
  initialState: { ...initialBasicAsyncState },
  reducers: {},
  extraReducers: (builder) => apiReducerBuilder(builder, signup),
});

export const {} = signupSlice.actions;

export default signupSlice.reducer;
