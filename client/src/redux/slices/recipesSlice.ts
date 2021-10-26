import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  RecipeReqError,
  RecipeLocalData,
  RecipeApiData,
  RecipesState,
} from "../../shared/types";
import {
  initialReqState,
  getAllRecipesURL,
  addRecipeURL,
  updateRecipeURL,
  deleteRecipeURL,
} from "../../shared/constants";
import { setupMultipleRecipeErrors } from "../../utils/errorUtils";
import { isThunk, thunkHandler } from "../asyncRequestStatusReducer";
import {
  getActiveRecipeFromLocalStorage,
  removeActiveRecipeFromLocalStorage,
  saveActiveRecipeToLocalStorage,
} from "../../utils/recipesUtils";

interface UpdateRecipeData {
  recipe: RecipeLocalData;
  id: string;
}

export const initialRecipesState: RecipesState = {
  recipes: [],
  activeRecipe: getActiveRecipeFromLocalStorage() as RecipeApiData,
  ...initialReqState,
  initialLoadAllRecipes: true,
};

const initialAddOrUpdateRecipeErrors = {
  titleErrorMessage: "",
  imgErrorMessage: "",
  categoryErrorMessage: "",
  ingredientsErrorMessage: "",
  instructionsErrorMessage: "",
};

export const getRecipes = createAsyncThunk<
  void,
  undefined,
  { rejectValue: RecipeReqError }
>("recipes/getRecipes", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(getAllRecipesURL);
    dispatch(recipesSet({ recipes: res.data }));
    dispatch(setInitialAllRecipesLoadFalse());
  } catch (err: any) {
    console.log(err.response);
    const { status, statusText } = err.response;
    return rejectWithValue({ status, message: statusText });
  }
});

export const addRecipe = createAsyncThunk<
  void,
  RecipeLocalData,
  { rejectValue: RecipeReqError }
>("recipes/addRecipe", async (recipeData, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.post(addRecipeURL, { ...recipeData });
    dispatch(recipeAdded({ recipe: res.data }));
  } catch (err: any) {
    console.log(err.response);
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
});

export const updateRecipe = createAsyncThunk<
  void,
  UpdateRecipeData,
  { rejectValue: RecipeReqError }
>(
  "recipes/updateRecipe",
  async (updateRecipeData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.put(updateRecipeURL(updateRecipeData.id), {
        ...updateRecipeData.recipe,
      });
      dispatch(recipeUpdated({ recipe: res.data }));
      dispatch(activeRecipeReset());
    } catch (err: any) {
      console.log(err.response);
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
    dispatch(recipeDeleted({ id: res.data }));
  } catch (err: any) {
    console.log(err.response);
    const { status, statusText } = err.response;
    return rejectWithValue({ status, message: statusText });
  }
});

const recipesSlice = createSlice({
  name: "recipes",
  initialState: { ...initialRecipesState },
  reducers: {
    recipesSet: (
      state,
      { payload }: PayloadAction<{ recipes: RecipeApiData[] }>
    ) => {
      state.recipes = payload.recipes;
    },
    recipeAdded: (
      state,
      { payload }: PayloadAction<{ recipe: RecipeApiData }>
    ) => {
      state.recipes.push(payload.recipe);
    },
    recipeDeleted: (state, { payload }: PayloadAction<{ id: string }>) => {
      state.recipes = state.recipes.filter(
        (recipe) => recipe._id !== payload.id
      );
    },
    recipeUpdated: (
      state,
      { payload }: PayloadAction<{ recipe: RecipeApiData }>
    ) => {
      const changedRecipeIndex = state.recipes.findIndex((recipe) => {
        return recipe._id === payload.recipe._id;
      });
      state.recipes[changedRecipeIndex] = payload.recipe;
    },
    activeRecipeSet: (
      state,
      { payload }: PayloadAction<{ recipeToUpdate: RecipeApiData }>
    ) => {
      state.activeRecipe = payload.recipeToUpdate;
      saveActiveRecipeToLocalStorage(payload.recipeToUpdate);
    },
    activeRecipeReset: (state) => {
      state.activeRecipe = initialRecipesState.activeRecipe;
      removeActiveRecipeFromLocalStorage();
    },
    resetReqState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errors.status = null;
      state.errors.message = "";
    },
    setInitialAllRecipesLoadFalse: (state) => {
      state.initialLoadAllRecipes = false;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getRecipes.pending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        isThunk(getRecipes, addRecipe, updateRecipe, deleteRecipe),
        thunkHandler
      ),
});

export const {
  recipesSet,
  recipeAdded,
  recipeUpdated,
  recipeDeleted,
  resetReqState,
  activeRecipeReset,
  activeRecipeSet,
  setInitialAllRecipesLoadFalse,
} = recipesSlice.actions;

export default recipesSlice.reducer;
