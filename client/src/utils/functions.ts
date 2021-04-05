import { AxiosError } from "axios";
import {
  CustomAuthError,
  BasicAsyncState,
  ValidationErrorData,
  MultipleInputFieldFormErrors,
} from "../utils/@types/types";
import { ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit";

export const convertToCustomErrObj = (
  status: number,
  message: MultipleInputFieldFormErrors | string
) => {
  const errorObj = {
    status,
    message,
  };
  return errorObj;
};

export const setupMultipleErrors = (
  error: AxiosError,
  initialErrors: MultipleInputFieldFormErrors
) => {
  let errorsData = { ...initialErrors };
  if (error.response) {
    error.response.data.data.forEach((errorObj: ValidationErrorData) => {
      if (errorObj.param === "email") {
        errorsData.emailErrorMessage = errorObj.msg;
      } else if (errorObj.param === "password") {
        errorsData.passwordErrorMessage = errorObj.msg;
      } else if (errorObj.param === "confirmPassword") {
        errorsData.confirmPasswordErrorMessage = errorObj.msg;
      } else return;
    });
  }
  return errorsData;
};

const getSerializedErrorStatus = (errorMessage: string | undefined) => {
  if (!errorMessage) return null;
  const errorMessageArr = errorMessage.split(" ");
  return parseInt(errorMessageArr[errorMessageArr.length - 1]);
};

export function apiReducerBuilder<T, U>(
  builder: ActionReducerMapBuilder<BasicAsyncState>,
  customThunk: AsyncThunk<
    T,
    U,
    {
      rejectValue: CustomAuthError;
    }
  >
) {
  return builder
    .addCase(customThunk.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(customThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.errors.status = null;
      state.errors.message = "";
    })
    .addCase(customThunk.rejected, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.errors = action.payload;
      } else if (action.error && action.error.message) {
        state.errors.status = getSerializedErrorStatus(action.error.message);
        state.errors.message = action.error.message;
      }
    });
}
