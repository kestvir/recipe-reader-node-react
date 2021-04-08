import {
  AsyncThunk,
  AnyAction,
  Draft,
  SerializedError,
} from "@reduxjs/toolkit";
import { ReqStatus, AppErrors } from "../shared/types";
import { getSerializedErrorStatus } from "../utils/errorUtils";

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;

const isPendingAction = (action: AnyAction): action is PendingAction => {
  return action.type.endsWith("/pending");
};

const isRejectedAction = (action: AnyAction): action is RejectedAction => {
  return action.type.endsWith("/rejected");
};

const isFulfilledAction = (action: AnyAction): action is FulfilledAction => {
  return action.type.endsWith("/fulfilled");
};

export const isThunk = <T extends AsyncThunk<any, any, any>[]>(
  ...thunks: T
) => (action: AnyAction) =>
  thunks.some((thunk) => action.type.startsWith(thunk.typePrefix));

export const thunkHandler = <S extends ReqStatus>(
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
      state.errors = action.payload as AppErrors;
    } else if (action.error) {
      const serializedError = action.error as SerializedError;
      state.errors.status = getSerializedErrorStatus(serializedError.message);
      if (serializedError.message) {
        state.errors.message = serializedError.message;
      }
    }
  }
};
