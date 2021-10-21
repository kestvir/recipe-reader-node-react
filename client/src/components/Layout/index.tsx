import React, { useCallback, useEffect, useRef } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useHistory } from "react-router-dom";
import { convertToRaw } from "draft-js";
import alanBtn from "@alan-ai/alan-sdk-web";
import { AlanButton } from "@alan-ai/alan-sdk-web/dist/AlanButton";
import Footer from "./Footer";
import Header from "./Header";
import { State } from "../../shared/types";
import { convertRichTextDataFromStrToEditorState } from "../../utils/richTextUtils";

interface LayoutProps {
  children: React.ReactNode;
}

interface CommandData {
  command: string;
  recipeId: string;
}

interface RecipeForAlan {
  title: string;
  category: string;
  _id: string;
  ingredients: string[] | [];
  instructions: string[] | [];
}

const ALAN_SDK_KEY = process.env.REACT_APP_ALAN_SDK_KEY as string;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const userId = useAppSelector((state: State) => state.auth.id);
  const recipes = useAppSelector((state: State) => state.recipes.recipes);

  const alanBtnInstance = useRef<null | AlanButton>(null);

  const history = useHistory();

  const getConvertedRecipesToReadableText = useCallback(() => {
    let convertedRecipes: Array<RecipeForAlan> = [];

    recipes.forEach((recipe) => {
      const { title, category, ingredients, instructions, _id } = recipe;

      const editorStateIngredients =
        convertRichTextDataFromStrToEditorState(ingredients);

      const editorStateInstructions =
        convertRichTextDataFromStrToEditorState(instructions);

      const rawIngredients = convertToRaw(
        editorStateIngredients.getCurrentContent()
      );

      const rawInstructions = convertToRaw(
        editorStateInstructions.getCurrentContent()
      );

      const ingredientssArr = rawIngredients.blocks.map((ingredient) => {
        return ingredient.text;
      });

      const instructionsArr = rawInstructions.blocks.map((instruction) => {
        return instruction.text;
      });

      const recipeObj: RecipeForAlan = {
        _id,
        title,
        category,
        ingredients: ingredientssArr,
        instructions: instructionsArr,
      };
      convertedRecipes.push(recipeObj);
    });

    return convertedRecipes;
  }, [recipes]);

  useEffect(() => {
    if (userId && !alanBtnInstance.current) {
      alanBtnInstance.current = alanBtn({
        key: ALAN_SDK_KEY,
        onCommand: (commandData: CommandData) => {
          switch (commandData.command) {
            case "goToRecipes":
              history.push("/recipes");
              break;
            case "goToHome":
              history.push("/");
              break;
            case "goToDocs":
              history.push("/documentation");
              break;
            case "goBack":
              history.goBack();
              break;
            case "openRecipe":
              history.push(`/recipe/${commandData.recipeId}`);
              break;
            default:
              history.push("/documentation");
          }
        },
      });
    }

    const alanRoot = document.getElementsByClassName("alanBtn-root")[0];

    if (alanRoot && !userId) {
      alanRoot.remove();
    }
  }, [userId, history]);

  useEffect(() => {
    if (recipes.length && alanBtnInstance.current) {
      alanBtnInstance.current.setVisualState({
        recipes: getConvertedRecipesToReadableText(),
      });
    }
  }, [recipes, getConvertedRecipesToReadableText]);

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
