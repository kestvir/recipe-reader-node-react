import express, { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Recipe, { recipe } from "../models/Recipe";
import { validationResult } from "express-validator";
import * as recipeValidators from "../validators/recipes";
import { checkValidationErrors } from "../utils/errorUtils";
import { User as IUser, Recipe as IRecipe } from "../shared/types";

const router = express.Router();

router.get("/all", async (req, res, next) => {
  const reqUser = req.user as IUser;
  try {
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

router.put(
  "/update/:id",
  recipeValidators.updateRecipeValidator,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    checkValidationErrors(errors);

    const recipeId = req.params.id;
    (async () => {
      try {
        await Recipe.findByIdAndUpdate(
          recipeId,
          { $set: req.body },
          { new: true },
          (err, recipe) => {
            if (!err) {
              res.send(recipe);
            }
          }
        );
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    })();
  }
);

router.delete("/delete/:id", async (req, res, next) => {
  const recipeId = req.params.id;
  const reqUser = req.user as IUser;

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId).exec();
    await User.findOneAndUpdate(
      { _id: reqUser.id },
      { $pull: { recipes: deletedRecipe.id } },
      { new: true },
      (err, updatedUser) => {
        if (!err) {
          res.send(deletedRecipe.id);
        }
      }
    );
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

export default router;
