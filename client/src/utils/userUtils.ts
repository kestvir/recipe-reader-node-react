import { User } from "../shared/types";

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("recipeReaderUser");
};

export const saveUserToLocalStorage = (
  id: string,
  email: string,
  googleId: string,
  facebookId: string
) => {
  localStorage.setItem(
    "recipeReaderUser",
    JSON.stringify({ id, email, googleId, facebookId })
  );
};

export const getUserFromLocalStorage = () => {
  const initialUserObj: User = {
    id: "",
    email: "",
    facebookId: "",
    googleId: "",
  };
  let parsedUser: User | null = null;
  const userStr = localStorage.getItem("recipeReaderUser");
  if (typeof userStr === "string") {
    parsedUser = JSON.parse(userStr);
  }
  if (parsedUser !== null && parsedUser.id) {
    return parsedUser;
  } else {
    return initialUserObj;
  }
};
