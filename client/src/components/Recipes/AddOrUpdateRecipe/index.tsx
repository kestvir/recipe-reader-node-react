import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import "@nick4fake/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { addRecipeURL } from "../../../utils/backendUrls";
import {
  ImgFile,
  ValidationErrorData,
  AddOrUpdateRecipeErrors,
} from "../../../utils/@types/types";
import Input from "../../UI/Input";
import SelectImg from "./SelectImg";
import IngredientOrInstructionTextField from "./IngredientOrInstructionTextField";
import SelectCategory from "./SelectCategory";

interface AddOrUpdateRecipeProps {}

const initialAddOrUpdateRecipeErrors = {
  titleErrorMessage: "",
  imgErrorMessage: "",
  categoryErrorMessage: "",
  ingredientsErrorMessage: "",
  instructionsErrorMessage: "",
};

const AddOrUpdateRecipe: React.FC<AddOrUpdateRecipeProps> = ({}) => {
  const [loading, setLoading] = useState(false);
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
  const [errors, setErrors] = useState<AddOrUpdateRecipeErrors>({
    ...initialAddOrUpdateRecipeErrors,
  });
  const [displayErrors, setDisplayErrors] = useState(false);

  const history = useHistory();

  const storeErrors = (errorData: ValidationErrorData[]) => {
    const newErrorObj: AddOrUpdateRecipeErrors = {
      ...initialAddOrUpdateRecipeErrors,
    };
    errorData.forEach((error) => {
      const { param, msg } = error;
      switch (param) {
        case "title":
          newErrorObj.titleErrorMessage = msg;
          break;
        case "category":
          newErrorObj.categoryErrorMessage = msg;
          break;
        case "img":
          newErrorObj.imgErrorMessage = msg;
          break;
        case "ingredients":
          newErrorObj.ingredientsErrorMessage = msg;
          break;
        case "instructions":
          newErrorObj.instructionsErrorMessage = msg;
          break;
        default:
          return;
      }
    });
    setErrors(newErrorObj);
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
      img: selectedImg.file,
      category,
      ingredients: ingredientsStr,
      instructions: instructionsStr,
    };

    try {
      setLoading(true);
      setDisplayErrors(false);
      const res = await axios.post(addRecipeURL, recipeObj);
      if (res.data === "success") {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      if (err.response.status === 401) return history.push("/login");
      setDisplayErrors(true);
      storeErrors(err.response.data.data);
      console.error(err.response);
    }
  };

  const {
    titleErrorMessage,
    categoryErrorMessage,
    imgErrorMessage,
    ingredientsErrorMessage,
    instructionsErrorMessage,
  } = errors;

  return (
    <section className="section" id="addRecipeSection">
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
              />

              <IngredientOrInstructionTextField
                editorState={ingredients}
                setEditorState={setIngredients}
                label="Ingredients"
                errorMessage={ingredientsErrorMessage}
                displayErrors={displayErrors}
              />

              <IngredientOrInstructionTextField
                editorState={instructions}
                setEditorState={setInstructions}
                label="Instructions"
                errorMessage={instructionsErrorMessage}
                displayErrors={displayErrors}
              />

              <SelectCategory
                category={category}
                setCategory={setCategory}
                errorMessage={categoryErrorMessage}
                displayErrors={displayErrors}
              />

              <SelectImg
                selectedImg={selectedImg}
                setSelectedImg={setSelectedImg}
                errorMessage={imgErrorMessage}
                displayErrors={displayErrors}
              />

              <div className="field is-flex is-justify-content-flex-end	">
                <div className="control">
                  <button
                    className={`button is-primary has-text-centered is-size-5 ${
                      loading && "is-loading"
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
