import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { State } from "../../shared/types";
import draftToHtml from "draftjs-to-html";
import { resetActiveRecipe } from "../../redux/slices/recipesSlice";
import DeleteRecipeModal from "./DeleteRecipeModal";

interface RecipeDetailsProps {}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({}) => {
  const { activeRecipe } = useAppSelector((state: State) => state.recipes);
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { title, img, category, ingredients, instructions } = activeRecipe;

  const imgSrc = img as string;

  const convertStrToHTML = (str: string) => {
    return draftToHtml(JSON.parse(str));
  };

  const htmlIngredients = convertStrToHTML(ingredients);
  const htmlInstructions = convertStrToHTML(instructions);

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  useEffect(() => {
    return () => {
      dispatch(resetActiveRecipe());
    };
  }, []);

  return (
    <section className="section has-text-centered">
      {isModalOpen && (
        <DeleteRecipeModal closeModal={toggleModal} recipeTitle={title} />
      )}
      <div className="container is-max-desktop">
        <img
          src={imgSrc}
          alt="Recipe Image"
          style={{ maxWidth: "100%", width: "700px" }}
        />
        <div className="is-flex is-flex-direction-row is-justify-content-center block">
          <button className="button is-primary is-light mr-2">Update</button>
          <button className="button is-danger" onClick={toggleModal}>
            Delete
          </button>
        </div>
        <div className="block">
          <h2 className="title is-2">{title}</h2>
          <h4 className="title is-4 has-text-primary">{category}</h4>
        </div>
        <div className="block">
          <h4 className="title is-5">Ingredients</h4>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: htmlIngredients }}
          />
        </div>
        <div>
          <h4 className="title is-5">Instructions</h4>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: htmlInstructions }}
          />
        </div>
      </div>
    </section>
  );
};

export default RecipeDetails;
