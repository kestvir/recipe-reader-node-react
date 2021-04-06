import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  Recipe,
  RecipesState,
  CustomRecipeRequestError,
} from "../../utils/@types/types";
import { getAllRecipesURL, addRecipeURL } from "../../utils/backendUrls";
import { initialBasicAsyncState } from "../../utils/constants";
import { setupMultipleRecipeErrors } from "../../utils/functions";
import { isThunk, thunkHandler } from "../../utils/reduxHelper";

export const initialRecipesState: RecipesState = {
  recipes: [],
  activeRecipe: {
    title: "",
    category: "entree",
    img: "",
    ingredients: "",
    instructions: "",
  },
};

export const getAllRecipes = createAsyncThunk<
  void,
  any,
  { rejectValue: CustomRecipeRequestError }
>("recipes/getAllRecipes", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(getAllRecipesURL);
    dispatch(setRecipes({ recipes: res.data }));
  } catch (err) {
    console.log(err);
    const { status, statusText } = err.response;
    return rejectWithValue({ status, message: statusText });
  }
});

export const addOrUpdateRecipe = createAsyncThunk<
  void,
  Recipe,
  { rejectValue: CustomRecipeRequestError }
>(
  "recipes/addOrUpdateRecipe",
  async (recipeData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(addRecipeURL, { ...recipeData });
      dispatch(addRecipe({ recipe: res.data }));
    } catch (err) {
      console.log(err);
      const { status, statusText, data } = err.response;
      if (status === 422) {
        const formattedErrors = setupMultipleRecipeErrors(data.data);
        return rejectWithValue({ status, message: formattedErrors });
      }
      return rejectWithValue({ status, message: statusText });
    }
  }
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState: { ...initialRecipesState, ...initialBasicAsyncState },
  reducers: {
    setRecipes: (state, { payload }: PayloadAction<{ recipes: Recipe[] }>) => {
      state.recipes = payload.recipes;
    },
    addRecipe: (state, { payload }: PayloadAction<{ recipe: Recipe }>) => {
      state.recipes.push(payload.recipe);
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getAllRecipes.pending, (state, action) => {
        state.isLoading = true;
      })
      .addMatcher(isThunk(getAllRecipes, addOrUpdateRecipe), thunkHandler),
});

export const { setRecipes, addRecipe } = recipesSlice.actions;

export default recipesSlice.reducer;
