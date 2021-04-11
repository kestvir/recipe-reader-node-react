import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { State } from "../../shared/types";
import { getRecipes, resetReqState } from "../../redux/slices/recipesSlice";
import RecipeCard from "./RecipeCard";
import Progressbar from "../UI/Progressbar";
import RecipesFilteTabs from "./RecipesFiltertTabs";

interface PostsProps {}

const Recipes: React.FC<PostsProps> = ({}) => {
  const {
    isSuccess,
    isLoading,
    errors,
    recipes,
    initialLoadAllRecipes,
  } = useAppSelector((state: State) => state.recipes);
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    if (initialLoadAllRecipes) {
      dispatch(getRecipes());
    }
    return () => {
      dispatch(resetReqState());
    };
  }, [initialLoadAllRecipes]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetReqState());
    }
  }, [isSuccess]);

  if (isLoading) return <Progressbar />;

  const changeActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <section className="section">
      <div className="container">
        <RecipesFilteTabs
          activeTab={activeTab}
          changeActiveTab={changeActiveTab}
        />
        <div className="columns is-multiline is-justify-content-center	">
          {recipes.map((recipe, index) => {
            return (
              <div
                className="column is-one-quarter-desktop is-half-tablet"
                key={index}
                style={
                  activeTab.toLocaleLowerCase() !== recipe.category &&
                  activeTab !== "All"
                    ? { display: "none" }
                    : {}
                }
              >
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
