import { Recipe } from "../shared/types";

export const removeActiveRecipeFromLocalStorage = () => {
  localStorage.removeItem("activeRecipe");
};

export const saveActiveRecipeToLocalStorage = (recipe: Recipe) => {
  localStorage.setItem("activeRecipe", JSON.stringify(recipe));
};

export const getActiveRecipeFromLocalStorage = () => {
  const initialActiveRecipe: Recipe = {
    title: "",
    category: "entree",
    img: "",
    ingredients: "",
    instructions: "",
  };
  let parsedActiveRecipe: Recipe | null = null;
  const activeRecipeStr = localStorage.getItem("activeRecipe");
  if (typeof activeRecipeStr === "string") {
    parsedActiveRecipe = JSON.parse(activeRecipeStr);
  }
  if (parsedActiveRecipe !== null && parsedActiveRecipe.title) {
    return parsedActiveRecipe;
  } else {
    return initialActiveRecipe;
  }
};
