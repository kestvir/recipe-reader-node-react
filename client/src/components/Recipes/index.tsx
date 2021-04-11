import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { Link } from "react-router-dom";
import { State } from "../../shared/types";
import { getRecipes, resetReqState } from "../../redux/slices/recipesSlice";
import RecipeCard from "./RecipeCard";
import Progressbar from "../UI/Progressbar";
import RecipesFilteTabs from "./RecipesFiltertTabs";
import SearchRecipesInput from "./SearchRecipesInput";

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
  const [searchVal, setSearchVal] = useState("");

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

  const filteredBySearchRecipes = recipes.filter((recipe) => {
    return recipe.title.toLowerCase().indexOf(searchVal.toLowerCase()) !== -1;
  });

  return (
    <section id="recipes-section" className="section">
      <div className="container">
        {!recipes.length ? (
          <div className="is-flex is-flex-direction-column is-align-items-center">
            <p className="title">No recipes found.</p>
            <button className="button is-primary is-medium">
              <Link className="has-text-white" to="/recipes/add">
                Add a recipe!
              </Link>
            </button>
          </div>
        ) : (
          <>
            <SearchRecipesInput
              searchVal={searchVal}
              setSearchVal={setSearchVal}
            />
            <RecipesFilteTabs
              activeTab={activeTab}
              changeActiveTab={changeActiveTab}
            />
          </>
        )}

        <div className="columns is-multiline is-justify-content-center mt-3">
          {!filteredBySearchRecipes.length && (
            <p className="title">No recipes found.</p>
          )}
          {filteredBySearchRecipes.map((recipe, index) => {
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
