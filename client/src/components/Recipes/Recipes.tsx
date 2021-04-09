import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { State } from "../../shared/types";
import { getAllRecipes, resetReqState } from "../../redux/slices/recipesSlice";
import RecipeCard from "./RecipeCard";
import Progressbar from "../UI/Progressbar";

interface PostsProps {}

const Recipes: React.FC<PostsProps> = ({}) => {
  const { isLoading, errors, recipes } = useAppSelector(
    (state: State) => state.recipes
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllRecipes());
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetReqState());
    };
  }, []);

  if (isLoading) return <Progressbar />;

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-multiline is-justify-content-center	">
          {recipes.map((recipe, index) => {
            return (
              <div className="column is-one-quarter" key={index}>
                <RecipeCard recipe={recipe} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Recipes;
