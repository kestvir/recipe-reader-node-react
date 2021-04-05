import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CustomAuthError, BasicAsyncState } from "../../utils/@types/types";
import { resetPasswordTokenURL } from "../../utils/backendUrls";
// import { initialBasicAsyncState } from "../../utils/constants";
import { apiReducerBuilder, setupMultipleErrors } from "../../utils/functions";

export const initialBasicAsyncState: BasicAsyncState = {
  isLoading: false,
  isSuccess: false,
  errors: { status: null, message: "" },
};

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
        const formattedErrors = setupMultipleErrors(
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
  extraReducers: (builder) =>
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload) state.errors = action.payload;
      }),
});

export const {} = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
