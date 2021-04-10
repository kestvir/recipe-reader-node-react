export interface ReqStatus {
  isLoading: boolean;
  isSuccess: boolean;
  errors: AppErrors;
}

export interface ValidationErrorData {
  msg: string;
  param: string;
  value?: string;
  location?: string;
}

export interface State {
  auth: AuthState;
  recipes: RecipesState;
}

export interface User {
  id: string;
  email: string;
  facebookId: string;
  googleId: string;
}

export interface RecipeLocalData {
  title: string;
  category: string;
  img: ImgFile;
  ingredients: string;
  instructions: string;
}

export interface RecipeApiData {
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  category: string;
  img: ImgFile;
  ingredients: string;
  instructions: string;
}

export interface InitialActiveRecipe {
  _id?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
  title: string;
  category: string;
  img: ImgFile;
  ingredients: string;
  instructions: string;
}

export interface RecipesState extends ReqStatus {
  recipes: RecipeApiData[];
  activeRecipe: RecipeApiData;
  initialLoadAllRecipes: boolean;
}

export interface AuthState extends ReqStatus, User {}

export type AppErrors = AuthReqError | RecipeReqError;

export interface AuthReqError {
  status: number | null;
  message: string | MultipleAuthInputFieldFormErrors;
}

export interface RecipeReqError {
  status: number | null;
  message: string | AddOrUpdateRecipeErrors;
}

export interface MultipleAuthInputFieldFormErrors {
  emailErrorMessage?: string;
  passwordErrorMessage: string;
  confirmPasswordErrorMessage: string;
}

export interface AddOrUpdateRecipeErrors {
  titleErrorMessage: string;
  categoryErrorMessage: string;
  imgErrorMessage: string;
  ingredientsErrorMessage: string;
  instructionsErrorMessage: string;
}

export interface ImgFile {
  name: string;
  file: string | ArrayBuffer | null | Blob;
}
