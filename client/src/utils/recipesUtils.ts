import {
  RecipeApiData,
  RecipeLocalData,
  InitialActiveRecipe,
} from "../shared/types";

export const removeActiveRecipeFromLocalStorage = () => {
  localStorage.removeItem("activeRecipe");
};

export const saveActiveRecipeToLocalStorage = (recipe: RecipeApiData) => {
  localStorage.setItem("activeRecipe", JSON.stringify(recipe));
};

export const getActiveRecipeFromLocalStorage = () => {
  const initialActiveRecipe: RecipeLocalData = {
    title: "",
    category: "entree",
    img: {
      file: "",
      name: "Select image...",
    },
    ingredients: "",
    instructions: "",
  };
  let parsedActiveRecipe: InitialActiveRecipe | RecipeApiData | null = null;
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
