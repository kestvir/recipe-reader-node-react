import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { State } from "../../shared/types";
import draftToHtml from "draftjs-to-html";
import DeleteRecipeModal from "./DeleteRecipeModal";

interface RecipeDetailsProps {}

interface Params {
  id: string;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({}) => {
  const { activeRecipe } = useAppSelector((state: State) => state.recipes);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const history = useHistory();
  const params: Params = useParams();

  const { title, img, category, ingredients, instructions } = activeRecipe;

  const imgSrc = img.file as string;

  const convertStrToHTML = (str: string) => {
    return draftToHtml(JSON.parse(str));
  };

  const htmlIngredients = convertStrToHTML(ingredients);
  const htmlInstructions = convertStrToHTML(instructions);

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  const goToUpdateRecipe = () => {
    history.push(`/recipe/update/${params.id}`);
  };

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
          <button
            className="button is-primary is-light mr-2"
            onClick={goToUpdateRecipe}
          >
            Update
          </button>
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
