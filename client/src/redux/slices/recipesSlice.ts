import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  Recipe,
  RecipesState,
  CustomAuthError,
} from "../../utils/@types/types";
import { getAllRecipesURL } from "../../utils/backendUrls";
import { initialBasicAsyncState } from "../../utils/constants";
import {
  convertToCustomErrObj,
  apiReducerBuilder,
} from "../../utils/functions";

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
  Recipe[],
  any,
  { rejectValue: CustomAuthError }
>("recipes/getAllRecipes", async (_, thunkAPI) => {
  try {
    const res: Recipe[] = await axios.get(getAllRecipesURL);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
    const { status, statusText } = err.response;
    const errorObj = convertToCustomErrObj(status, statusText);
    return thunkAPI.rejectWithValue(errorObj);
  }
});

const recipesSlice = createSlice({
  name: "recipes",
  initialState: { ...initialRecipesState, ...initialBasicAsyncState },
  reducers: {
    setRecipes: (state, { payload }: PayloadAction<{ recipes: Recipe[] }>) => {
      state.recipes = payload.recipes;
    },
  },
  extraReducers: (builder) => apiReducerBuilder(builder, getAllRecipes),
});

export const {} = recipesSlice.actions;

export default recipesSlice.reducer;
