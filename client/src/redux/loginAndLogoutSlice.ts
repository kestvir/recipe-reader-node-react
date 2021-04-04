// import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import {} from "../utils/@types/types";
// import { loginURL } from "../utils/backendUrls";

// export const initialRecipesState = {
//   isLoading: false,
//   isSuccess: false,
//   isError: false,
//   displayErrors: false,
//   errorMessage: "",
// };

// export const login = createAsyncThunk<
//   Recipe[],
//   any,
//   { rejectValue: RecipesError }
// >("recipes/getAllRecipes", async (payload, thunkAPI) => {
//   try {
//     const response: string = await axios.get(getAllRecipesURL);
//     return response;
//   } catch (err) {
//     const { status, statusText } = err.response;
//     const errObj: RecipesError = {
//       status,
//       statusText,
//     };
//     return thunkAPI.rejectWithValue(errObj);
//   }
// });

// const loginAndLogoutSlice = createSlice({
//   name: "loginAndLogout",
//   initialState: { ...initialRecipesState },
//   reducers: {},
//   extraReducers: (builder) =>
//     builder
//       .addCase(login.pending, (state, action) => {
//         state.isLoading = true;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.recipes = action.payload;
//         state.status = "success";
//       })
//       .addCase(login.rejected, (state, action) => {
//         if (action.payload) {
//           state.error = action.payload;
//         } else if (action.error) state.error = action.error;
//         state.status = "failed";
//       }),
// });

// export const {} = loginAndLogoutSlice.actions;

// export default loginAndLogoutSlice.reducer;
