import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RecipeReqError, Recipe, RecipesState } from "../../shared/types";
import {
  initialReqState,
  getAllRecipesURL,
  addRecipeURL,
} from "../../shared/constants";
import { setupMultipleRecipeErrors } from "../../utils/errorUtils";
import { isThunk, thunkHandler } from "../asyncRequestStatusReducer";

export const initialRecipesState: RecipesState = {
  recipes: [],
  activeRecipe: {
    title: "",
    category: "entree",
    img: "",
    ingredients: "",
    instructions: "",
  },
  ...initialReqState,
};

const initialAddOrUpdateRecipeErrors = {
  titleErrorMessage: "",
  imgErrorMessage: "",
  categoryErrorMessage: "",
  ingredientsErrorMessage: "",
  instructionsErrorMessage: "",
};

export const getAllRecipes = createAsyncThunk<
  void,
  undefined,
  { rejectValue: RecipeReqError }
>("recipes/getAllRecipes", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(getAllRecipesURL);
    console.log(res);
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
  { rejectValue: RecipeReqError }
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
        const formattedErrors = setupMultipleRecipeErrors(
          data.data,
          initialAddOrUpdateRecipeErrors
        );
        return rejectWithValue({ status, message: formattedErrors });
      }
      return rejectWithValue({ status, message: statusText });
    }
  }
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState: { ...initialRecipesState },
  reducers: {
    setRecipes: (state, { payload }: PayloadAction<{ recipes: Recipe[] }>) => {
      state.recipes = payload.recipes;
    },
    addRecipe: (state, { payload }: PayloadAction<{ recipe: Recipe }>) => {
      state.recipes.push(payload.recipe);
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
      .addCase(getAllRecipes.pending, (state, action) => {
        state.isLoading = true;
      })
      .addMatcher(isThunk(getAllRecipes, addOrUpdateRecipe), thunkHandler),
});

export const { setRecipes, addRecipe, resetReqState } = recipesSlice.actions;

export default recipesSlice.reducer;
