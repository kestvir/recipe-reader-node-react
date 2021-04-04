import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Recipe, RecipesState, RecipesError } from "../utils/@types/types";
import { getAllRecipesURL } from "../utils/backendUrls";

export const initialRecipesState: RecipesState = {
  recipes: [],
  activeRecipe: {
    title: "",
    category: "entree",
    img: "",
    ingredients: "",
    instructions: "",
  },
  status: "",
  error: { statusText: null, status: null },
};

export const getAllRecipes = createAsyncThunk<
  Recipe[],
  any,
  { rejectValue: RecipesError }
>("recipes/getAllRecipes", async (payload, thunkAPI) => {
  try {
    const response: Recipe[] = await axios.get(getAllRecipesURL);
    return response;
  } catch (err) {
    const { status, statusText } = err.response;
    const errObj: RecipesError = {
      status,
      statusText,
    };
    return thunkAPI.rejectWithValue(errObj);
  }
});

const recipesSlice = createSlice({
  name: "recipes",
  initialState: { ...initialRecipesState },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getAllRecipes.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAllRecipes.fulfilled, (state, action) => {
        state.recipes = action.payload;
        state.status = "success";
      })
      .addCase(getAllRecipes.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload;
        } else if (action.error) state.error = action.error;
        state.status = "failed";
      }),
});

export const {} = recipesSlice.actions;

export default recipesSlice.reducer;
