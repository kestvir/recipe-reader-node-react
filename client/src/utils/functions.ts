import { AxiosError } from "axios";
import {
  CustomAuthError,
  BasicAsyncState,
  ValidationErrorData,
  MultipleAuthInputFieldFormErrors,
  AddOrUpdateRecipeErrors,
} from "../utils/@types/types";
import { initialAddOrUpdateRecipeErrors } from "../utils/constants";
import { ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit";

export const convertToCustomErrObj = (
  status: number,
  message: MultipleAuthInputFieldFormErrors | string
) => {
  const errorObj = {
    status,
    message,
  };
  return errorObj;
};

export const setupMultipleAuthErrors = (
  error: AxiosError,
  initialErrors: MultipleAuthInputFieldFormErrors
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

export const setupMultipleRecipeErrors = (errorData: ValidationErrorData[]) => {
  const formattedErrorObj: AddOrUpdateRecipeErrors = {
    ...initialAddOrUpdateRecipeErrors,
  };
  errorData.forEach((error) => {
    const { param, msg } = error;
    switch (param) {
      case "title":
        formattedErrorObj.titleErrorMessage = msg;
        break;
      case "category":
        formattedErrorObj.categoryErrorMessage = msg;
        break;
      case "img":
        formattedErrorObj.imgErrorMessage = msg;
        break;
      case "ingredients":
        formattedErrorObj.ingredientsErrorMessage = msg;
        break;
      case "instructions":
        formattedErrorObj.instructionsErrorMessage = msg;
        break;
      default:
        return;
    }
  });
  return formattedErrorObj;
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
