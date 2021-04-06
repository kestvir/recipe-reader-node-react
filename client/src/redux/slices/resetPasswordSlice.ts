import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CustomAuthError } from "../../utils/@types/types";
import { resetPasswordTokenURL } from "../../utils/backendUrls";
import { initialBasicAsyncState } from "../../utils/constants";
import {
  apiReducerBuilder,
  setupMultipleAuthErrors,
} from "../../utils/functions";

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
  token: string;
}

const initialResetPasswordErrors = {
  passwordErrorMessage: "",
  confirmPasswordErrorMessage: "",
};

export const resetPassword = createAsyncThunk<
  void,
  ResetPasswordData,
  { rejectValue: CustomAuthError }
>(
  "resetPassword/resetPassword",
  async (resetPasswordData, { rejectWithValue }) => {
    const { password, confirmPassword, token } = resetPasswordData;
    try {
      await axios.post(resetPasswordTokenURL(token), {
        password,
        confirmPassword,
      });
    } catch (err) {
      console.error(err);
      const { status, statusText, data } = err.response;
      if (status === 422) {
        const formattedErrors = setupMultipleAuthErrors(
          err,
          initialResetPasswordErrors
        );
        return rejectWithValue({ status, message: formattedErrors });
      }
      if (status === 401) {
        return rejectWithValue({
          status,
          message: data.message,
        });
      }
      return rejectWithValue({ status, message: statusText });
    }
  }
);

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState: {
    ...initialBasicAsyncState,
  },
  reducers: {},
  extraReducers: (builder) => apiReducerBuilder(builder, resetPassword),
});

export const {} = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
