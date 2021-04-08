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
  const userStr = localStorage.getItem("recipeReaderUser");
  if (typeof userStr === "string") {
    return JSON.parse(userStr);
  } else return { id: "", email: "", facebookId: "", googleId: "" };
};
