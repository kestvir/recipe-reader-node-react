import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { useHistory, useParams } from "react-router-dom";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "@nick4fake/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ImgFile, State, AddOrUpdateRecipeErrors } from "../../../shared/types";
import Input from "../../UI/Input";
import SelectImg from "./SelectImg";
import IngredientOrInstructionRichTextField from "./IngredientOrInstructionRichTextField";
import SelectCategory from "./SelectCategory";
import {
  addRecipe,
  updateRecipe,
  resetReqState,
} from "../../../redux/slices/recipesSlice";

interface AddOrUpdateRecipeProps {}

interface Params {
  id: string;
}

const initialAddOrUpdateRecipeErrors = {
  titleErrorMessage: "",
  imgErrorMessage: "",
  categoryErrorMessage: "",
  ingredientsErrorMessage: "",
  instructionsErrorMessage: "",
};

const AddOrUpdateRecipe: React.FC<AddOrUpdateRecipeProps> = ({}) => {
  const { isLoading, isSuccess, errors, activeRecipe } = useAppSelector(
    (state: State) => state.recipes
  );

  const dispatch = useAppDispatch();
  const history = useHistory();
  const params: Params = useParams();

  const [title, setTitle] = useState("");
  const [selectedImg, setSelectedImg] = useState<ImgFile>({
    name: "Select image...",
    file: "",
  });
  const [category, setCategory] = useState("entree");
  const [ingredients, setIngredients] = useState<EditorState>(() =>
    EditorState.createEmpty()
  );
  const [instructions, setInstructions] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const { title, category, img, ingredients, instructions } = activeRecipe;
    if (params.id) {
      setTitle(title);
      setCategory(category);
      setSelectedImg({ name: img.name, file: img.file });
      setIngredients(convertRichTextDataFromStr(ingredients));
      setInstructions(convertRichTextDataFromStr(instructions));
    }
  }, []);

  useEffect(() => {
    if (isSuccess || errors.status === 401) {
      history.push("/");
    }
  }, [isSuccess, errors]);

  useEffect(() => {
    return () => {
      dispatch(resetReqState());
    };
  }, []);

  const convertRichTextDataFromStr = (str: string) => {
    return EditorState.createWithContent(convertFromRaw(JSON.parse(str)));
  };

  const getAndConvertEditorStateToStr = () => {
    let ingredientsStr;
    let instructionsStr;

    const ingredientContentState = ingredients.getCurrentContent();
    const instructionContentState = instructions.getCurrentContent();

    if (!ingredientContentState.hasText()) {
      ingredientsStr = "";
    } else {
      ingredientsStr = JSON.stringify(convertToRaw(ingredientContentState));
    }

    if (!instructionContentState.hasText()) {
      instructionsStr = "";
    } else {
      instructionsStr = JSON.stringify(convertToRaw(instructionContentState));
    }

    return { ingredientsStr, instructionsStr };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { ingredientsStr, instructionsStr } = getAndConvertEditorStateToStr();
    const recipeObj = {
      title,
      img: selectedImg,
      category,
      ingredients: ingredientsStr,
      instructions: instructionsStr,
    };
    if (params.id) {
      dispatch(updateRecipe({ recipe: recipeObj, id: params.id }));
    } else {
      dispatch(addRecipe(recipeObj));
    }
  };

  let {
    titleErrorMessage,
    categoryErrorMessage,
    imgErrorMessage,
    ingredientsErrorMessage,
    instructionsErrorMessage,
  } = initialAddOrUpdateRecipeErrors;

  const addOrUpdateRecipeErrorMessages = errors.message as AddOrUpdateRecipeErrors;
  if (errors.status === 422) {
    titleErrorMessage = addOrUpdateRecipeErrorMessages.titleErrorMessage;
    categoryErrorMessage = addOrUpdateRecipeErrorMessages.categoryErrorMessage;
    imgErrorMessage = addOrUpdateRecipeErrorMessages.imgErrorMessage;
    ingredientsErrorMessage =
      addOrUpdateRecipeErrorMessages.ingredientsErrorMessage;
    instructionsErrorMessage =
      addOrUpdateRecipeErrorMessages.instructionsErrorMessage;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-three-fifths is-offset-one-fifth box px-6 py-5">
            <form onSubmit={handleSubmit}>
              <Input
                value={title}
                name="title"
                type="text"
                label="Recipe title"
                handleChange={(e) => setTitle(e.target.value)}
                errorMessage={titleErrorMessage}
                displayErrors={!isLoading}
              />

              <IngredientOrInstructionRichTextField
                editorState={ingredients}
                setEditorState={setIngredients}
                label="Ingredients"
                errorMessage={ingredientsErrorMessage}
                displayErrors={!isLoading}
              />

              <IngredientOrInstructionRichTextField
                editorState={instructions}
                setEditorState={setInstructions}
                label="Instructions"
                errorMessage={instructionsErrorMessage}
                displayErrors={!isLoading}
              />

              <SelectCategory
                category={category}
                setCategory={setCategory}
                errorMessage={categoryErrorMessage}
                displayErrors={!isLoading}
              />

              <SelectImg
                selectedImg={selectedImg}
                setSelectedImg={setSelectedImg}
                errorMessage={imgErrorMessage}
                displayErrors={!isLoading}
              />

              <div className="field is-flex is-justify-content-flex-end	">
                <div className="control">
                  <button
                    className={`button is-primary has-text-centered is-size-5 ${
                      isLoading && "is-loading"
                    }`}
                    type="submit"
                  >
                    <strong>Submit</strong>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddOrUpdateRecipe;
