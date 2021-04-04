import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import recipesReducer from "./recipesSlice";

const reducer = { auth: authReducer, recipes: recipesReducer };

const store = configureStore({ reducer });

export type AppDispatch = typeof store.dispatch;

export default store;
