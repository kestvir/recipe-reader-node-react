import { AxiosError } from "axios";
import {
  MultipleAuthInputFieldFormErrors,
  ValidationErrorData,
  AddOrUpdateRecipeErrors,
} from "../shared/types";

export const getSerializedErrorStatus = (errorMessage: string | undefined) => {
  if (!errorMessage) return null;
  const errorMessageArr = errorMessage.split(" ");
  return parseInt(errorMessageArr[errorMessageArr.length - 1]);
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

export const setupMultipleRecipeErrors = (
  errorData: ValidationErrorData[],
  initialAddOrUpdateRecipeErrors: AddOrUpdateRecipeErrors
) => {
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
