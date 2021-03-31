import React, { useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import Input from "../UI/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { convertBase64 } from "../../utils/functions";

interface AddRecipeProps {}

interface IImgFile {
  name: string;
  file: string | ArrayBuffer | null;
}

const ACTIONS = {
  ADD_INGREDIENT: "ADD_INGREDIENT",
  ADD_INSTRUCTION: "ADD_INSTRUCTION",
  REMOVE_INGREDIENT: "REMOVE_INGREDIENT",
  REMOVE_INSTRUCTION: "REMOVE_INSTRUCTION",
};

const initialIngredientsAndInstructions = {
  ingredients: [{ value: "", id: uuidv4() }],
  instructions: [{ value: "", id: uuidv4() }],
};

// const reducer = (state: any, action: any) => {
//   switch (action.type) {
//   }
// }

const AddRecipe: React.FC<AddRecipeProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedImg, setSelectedImg] = useState<IImgFile>({
    name: "Select image...",
    file: "",
  });

  const handleFileRead = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      const base64 = await convertBase64(file);
      setSelectedImg({ name: file.name, file: base64 });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column">
            <form onSubmit={handleSubmit}>
              <Input
                value={title}
                name="title"
                type="text"
                label="Recipe title"
                handleChange={(e) => setTitle(e.target.value)}
              />
              <div className="file">
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    name="resume"
                    onChange={handleFileRead}
                  />
                  <span className="file-cta">
                    <span className="file-icon">
                      <FontAwesomeIcon icon={faUpload} />
                    </span>
                    <span className="file-label">Choose a file…</span>
                  </span>
                  <span className="file-name">{selectedImg.name}</span>
                </label>
              </div>
              <div className="field">
                <div className="control">
                  <button
                    className={`button is-primary has-text-centered is-size-5 ${
                      loading && "is-loading"
                    }`}
                    type="submit"
                  >
                    <strong>Log in</strong>
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

export default AddRecipe;
