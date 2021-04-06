import {
  AsyncThunk,
  AnyAction,
  Draft,
  SerializedError,
} from "@reduxjs/toolkit";
import { BasicAsyncState, CustomRecipeRequestError } from "./@types/types";

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;

function isPendingAction(action: AnyAction): action is PendingAction {
  return action.type.endsWith("/pending");
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("/rejected");
}

function isFulfilledAction(action: AnyAction): action is FulfilledAction {
  return action.type.endsWith("/fulfilled");
}

const getSerializedErrorStatus = (errorMessage: string | undefined) => {
  if (!errorMessage) return null;
  const errorMessageArr = errorMessage.split(" ");
  return parseInt(errorMessageArr[errorMessageArr.length - 1]);
};

export const isThunk = <T extends AsyncThunk<any, any, any>[]>(
  ...thunks: T
) => (action: AnyAction) =>
  thunks.some((thunk) => action.type.startsWith(thunk.typePrefix));

export const thunkHandler = <S extends BasicAsyncState>(
  state: Draft<S>,
  action: AnyAction
): void => {
  if (isPendingAction(action)) {
    state.isLoading = true;
  } else if (isFulfilledAction(action)) {
    state.isLoading = false;
    state.isSuccess = true;
    state.errors.status = null;
    state.errors.message = "";
  } else if (isRejectedAction(action)) {
    state.isLoading = false;
    if (action.payload) {
      state.errors = action.payload as CustomRecipeRequestError;
    } else if (action.error) {
      const serializedError = action.error as SerializedError;
      state.errors.status = getSerializedErrorStatus(serializedError.message);
      if (serializedError.message) {
        state.errors.message = serializedError.message;
      }
    }
  }
};
