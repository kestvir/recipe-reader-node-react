import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RecipeReqError, Recipe, RecipesState } from "../../shared/types";
import {
  initialReqState,
  getAllRecipesURL,
  addRecipeURL,
  deleteRecipeURL,
} from "../../shared/constants";
import { setupMultipleRecipeErrors } from "../../utils/errorUtils";
import { isThunk, thunkHandler } from "../asyncRequestStatusReducer";
import {
  getActiveRecipeFromLocalStorage,
  removeActiveRecipeFromLocalStorage,
  saveActiveRecipeToLocalStorage,
} from "../../utils/recipesUtils";

export const initialRecipesState: RecipesState = {
  recipes: [],
  activeRecipe: getActiveRecipeFromLocalStorage(),
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

export const deleteRecipe = createAsyncThunk<
  void,
  string,
  { rejectValue: RecipeReqError }
>("recipes/deleteRecipe", async (recipeId, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.delete(deleteRecipeURL(recipeId));
    console.log(res.data);
    dispatch(removeRecipe({ id: res.data }));
  } catch (err) {
    console.log(err);
    const { status, statusText } = err.response;
    return rejectWithValue({ status, message: statusText });
  }
});

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
    removeRecipe: (state, { payload }: PayloadAction<{ id: string }>) => {
      state.recipes = state.recipes.filter((recipe) => {
        if (recipe._id === payload.id) return recipe;
      });
    },
    setupActiveRecipe: (
      state,
      { payload }: PayloadAction<{ recipeToUpdate: Recipe }>
    ) => {
      state.activeRecipe = payload.recipeToUpdate;
      saveActiveRecipeToLocalStorage(payload.recipeToUpdate);
    },
    resetActiveRecipe: (state) => {
      state.activeRecipe = initialRecipesState.activeRecipe;
      removeActiveRecipeFromLocalStorage();
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
      .addMatcher(
        isThunk(getAllRecipes, addOrUpdateRecipe, deleteRecipe),
        thunkHandler
      ),
});

export const {
  setRecipes,
  addRecipe,
  removeRecipe,
  resetReqState,
  resetActiveRecipe,
  setupActiveRecipe,
} = recipesSlice.actions;

export default recipesSlice.reducer;
