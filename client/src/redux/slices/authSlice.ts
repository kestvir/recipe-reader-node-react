import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  initialReqState,
  getUserURL,
  loginURL,
  logoutURL,
  signupURL,
  forgotPasswordURL,
  resetPasswordTokenURL,
} from "../../shared/constants";
import { isThunk, thunkHandler } from "../asyncRequestStatusReducer";
import { AuthReqError, AuthState, User } from "../../shared/types";
import { setupMultipleAuthErrors } from "../../utils/errorUtils";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "../../utils/userUtils";

const initialUserState: User = getUserFromLocalStorage();

const initialAuthState: AuthState = {
  ...initialUserState,
  ...initialReqState,
};

interface UserSignupData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface UserLoginData {
  email: string;
  password: string;
}

type ForgotPasswordEmail = string;

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
  token: string;
}

const initialSignupErrors = {
  emailErrorMessage: "",
  passwordErrorMessage: "",
  confirmPasswordErrorMessage: "",
};

const initialResetPasswordErrors = {
  passwordErrorMessage: "",
  confirmPasswordErrorMessage: "",
};

export const resetPassword = createAsyncThunk<
  void,
  ResetPasswordData,
  { rejectValue: AuthReqError }
>("auth/resetPassword", async (resetPasswordData, { rejectWithValue }) => {
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
});

export const forgotPassword = createAsyncThunk<
  void,
  ForgotPasswordEmail,
  { rejectValue: AuthReqError }
>("auth/forgotPassword", async (email, { rejectWithValue }) => {
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
      return rejectWithValue({ status, message: statusText });
    }
  }
});

export const signup = createAsyncThunk<
  void,
  UserSignupData,
  { rejectValue: AuthReqError }
>("auth/signup", async (userSingupDataObj, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(signupURL, { ...userSingupDataObj });
    if (response.status === 200) {
      dispatch(getUser());
    }
  } catch (err) {
    console.error(err);
    const { status, statusText } = err.response;
    if (status === 422) {
      const formattedErrors = setupMultipleAuthErrors(err, initialSignupErrors);
      return rejectWithValue({ status, message: formattedErrors });
    }
    return rejectWithValue({ status, message: statusText });
  }
});

export const login = createAsyncThunk<
  void,
  UserLoginData,
  { rejectValue: AuthReqError }
>("auth/login", async (userLoginDataObj, { dispatch, rejectWithValue }) => {
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
      return rejectWithValue({ status, message: statusText });
    }
  }
});

export const logout = createAsyncThunk<
  void,
  undefined,
  { rejectValue: AuthReqError }
>("auth/logout", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(logoutURL);
    if (res.status === 200) {
      dispatch(clearUser());
    }
  } catch (err) {
    const { status, statusText } = err.response;
    return rejectWithValue({ status, message: statusText });
  }
});

export const getUser = createAsyncThunk<
  void,
  undefined,
  { rejectValue: AuthReqError }
>("auth/getUser", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(getUserURL);
    if (res.data) {
      dispatch(setUser({ userObj: res.data }));
    } else {
      dispatch(clearUser());
    }
  } catch (err) {
    console.error(err);
    const { status, statusText } = err.response;
    return rejectWithValue({ status, message: statusText });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { ...initialAuthState },
  reducers: {
    setUser: (state, { payload }: PayloadAction<{ userObj: User }>) => {
      const { id, email, googleId, facebookId } = payload.userObj;
      state.id = id;
      state.email = email;
      if (googleId) state.googleId = googleId;
      else if (facebookId) state.facebookId = facebookId;
      saveUserToLocalStorage(id, email, googleId, facebookId);
    },
    clearUser: (state) => {
      state.id = "";
      state.email = "";
      state.googleId = "";
      state.facebookId = "";
      removeUserFromLocalStorage();
    },
    resetReqState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errors.status = null;
      state.errors.message = "";
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(signup.pending, (state, action) => {
        state.isLoading = true;
      })
      .addMatcher(
        isThunk(getUser, signup, login, forgotPassword, resetPassword),
        thunkHandler
      ),
});

export const { setUser, clearUser, resetReqState } = authSlice.actions;

export default authSlice.reducer;
