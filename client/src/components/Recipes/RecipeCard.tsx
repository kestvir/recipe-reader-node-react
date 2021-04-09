import React from "react";
import { useAppDispatch } from "../../redux/hooks";
import { setupActiveRecipe } from "../../redux/slices/recipesSlice";
import { Link } from "react-router-dom";
import { Recipe } from "../../shared/types";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const dispatch = useAppDispatch();
  const { title, img, category, _id } = recipe;
  const id = _id as string;
  const imgSrc = img as string;
  return (
    <div className="card">
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={imgSrc} alt="Recipe image" style={{ objectFit: "cover" }} />
        </figure>
      </div>
      <div className="card-content has-text-centered">
        <div className="media mb-0">
          <div className="media-content">
            <p className="title is-4">{title}</p>
          </div>
        </div>
        <div className="content">
          <span className="tag is-primary is-light is-medium is-rounded my-2">
            {category}
          </span>
          <p>
            <Link
              onClick={() =>
                dispatch(setupActiveRecipe({ recipeToUpdate: recipe }))
              }
              to={`/recipe/${id}`}
            >
              Details
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
