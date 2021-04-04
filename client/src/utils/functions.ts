import { getUserURL } from "./backendUrls";
import axios from "axios";
import { AppDispatch } from "../redux/store";
import { initialAuthState, setUser } from "../redux/authSlice";

export const getUser = async (dispatch: AppDispatch) => {
  try {
    const res = await axios.get(getUserURL);
    if (res.data) {
      dispatch(setUser({ userObj: res.data }));
    } else {
      dispatch(setUser({ userObj: initialAuthState }));
      localStorage.removeItem("recipeReaderUser");
    }
  } catch (err) {
    console.error(err);
  }
};
