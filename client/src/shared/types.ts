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

export interface Recipe {
  title: string;
  category: string;
  img: string | ArrayBuffer | null | Blob;
  ingredients: string;
  instructions: string;
  _id?: string;
}

export interface RecipesState extends ReqStatus {
  recipes: Recipe[];
  activeRecipe: Recipe;
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
