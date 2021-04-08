import express, { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Recipe from "../models/Recipe";
import { validationResult } from "express-validator";
import * as recipeValidators from "../validators/recipes";
import { checkValidationErrors } from "../utils/errorUtils";
import { User as IUser, Recipe as IRecipe } from "../utils/types";

const router = express.Router();

router.get("/all", async (req, res, next) => {
  try {
    const reqUser = req.user as IUser;
    const user = await User.findById(reqUser.id);
    user.populate("recipes").execPopulate((err, result) => {
      if (err) next(err);
      else {
        const recipes = result.recipes;
        res.send(recipes);
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

// router.get("/entrees", (req, res) => {});

// router.get("/mains", (req, res) => {});

// router.get("/deserts", (req, res) => {});

router.post(
  "/add",
  recipeValidators.addRecipeValidator,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    checkValidationErrors(errors);
    const recipeDataObj: IRecipe = req.body;
    const recipe = new Recipe({ ...recipeDataObj });
    (async () => {
      try {
        await recipe.save();
        const reqUser = req.user as IUser;
        const user = await User.findById(reqUser.id);
        user.recipes.push(recipe);
        await user.save();
        res.send(recipeDataObj);
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    })();
  }
);

export default router;
