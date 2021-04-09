import { body } from "express-validator";

export const addRecipeValidator = [
  body("title").trim().notEmpty().withMessage("Title can not be empty."),
  body("category").notEmpty().withMessage("Category can not be empty."),
  body("img").notEmpty().withMessage("You have to select an image."),
  body("ingredients")
    .notEmpty()
    .withMessage("Ingredient list can not be empty"),
  body("instructions")
    .notEmpty()
    .withMessage("Instruction list can not be empty"),
  body("category").custom((value) => {
    if (value !== "entree" && value !== "main" && value !== "desert") {
      throw new Error("Category does not exist");
    }
    return true;
  }),
];

export const updateRecipeValidator = [...addRecipeValidator];
