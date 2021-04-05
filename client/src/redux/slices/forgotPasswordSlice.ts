import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CustomAuthError } from "../../utils/@types/types";
import { forgotPasswordURL } from "../../utils/backendUrls";
import { initialBasicAsyncState } from "../../utils/constants";
import {
  convertToCustomErrObj,
  apiReducerBuilder,
} from "../../utils/functions";

type ForgotPasswordEmail = string;

export const forgotPassword = createAsyncThunk<
  void,
  ForgotPasswordEmail,
  { rejectValue: CustomAuthError }
>("forgotPassword/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    await axios.post(forgotPasswordURL, { email });
  } catch (err) {
    console.error(err);
    const { status, statusText, data } = err.response;
    if (status === 401) {
      return rejectWithValue({
        status,
        message: data.message,
      });
    } else {
      const errorObj = convertToCustomErrObj(status, statusText);
      return rejectWithValue(errorObj);
    }
  }
});

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState: { ...initialBasicAsyncState },
  reducers: {},
  extraReducers: (builder) => apiReducerBuilder(builder, forgotPassword),
});

export const {} = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
