import { BasicAsyncState } from "../utils/@types/types";

export const dishCategories = ["entree", "main", "desert"];

export const initialBasicAsyncState: BasicAsyncState = {
  isLoading: false,
  isSuccess: false,
  errors: { status: null, message: "" },
};
