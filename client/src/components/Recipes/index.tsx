import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { Link } from "react-router-dom";
import { State } from "../../shared/types";
import { getRecipes, resetReqState } from "../../redux/slices/recipesSlice";
import RecipeCard from "./RecipeCard";
import Progressbar from "../UI/Progressbar";
import FilterRecipesTabs from "./FilterRecipesTabs";
import SearchRecipesInput from "./SearchRecipesInput";
import { RecipeApiData } from "../../shared/types";

const Recipes = () => {
  const { isSuccess, isLoading, recipes, initialLoadAllRecipes } =
    useAppSelector((state: State) => state.recipes);
  const dispatch = useAppDispatch();

  const [filteredRecipes, setFilteredRecipes] = useState<Array<RecipeApiData>>(
    []
  );
  const [activeTab, setActiveTab] = useState("All");
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    if (initialLoadAllRecipes) {
      dispatch(getRecipes());
    }

    if (recipes.length) setFilteredRecipes(recipes);

    return () => {
      dispatch(resetReqState());
    };
  }, [initialLoadAllRecipes, recipes, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetReqState());
    }
  }, [isSuccess, dispatch]);

  if (isLoading) return <Progressbar />;

  const changeActiveTab = (tab: string) => {
    setActiveTab(tab);
    setSearchVal("");

    if (tab === "All") {
      setFilteredRecipes(recipes);
      return;
    }

    filterRecipesByCategory(tab);
  };

  const filterRecipesByCategory = (tab: string) => {
    const filteredByCategoryRecipes = recipes.filter(
      (recipe) => recipe.category === tab.toLowerCase()
    );

    setFilteredRecipes(filteredByCategoryRecipes);
  };

  const filterRecipesBySearch = (searchVal: string) => {
    setSearchVal(searchVal);

    if (!searchVal.trim()) {
      filterRecipesByCategory(activeTab);
      return;
    }

    const filteredRecipesBySearch = filteredRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().indexOf(searchVal.trim().toLowerCase()) !==
        -1
    );

    setFilteredRecipes(filteredRecipesBySearch);
  };

  return (
    <section id="recipes-section" className="section">
      <div className="container">
        {!recipes.length && !initialLoadAllRecipes ? (
          <div className="is-flex is-flex-direction-column is-align-items-center is-justify-content-center is-fullheight">
            <p className="title">No recipes found.</p>
            <Link className="has-text-white" to="/recipes/add">
              <button className="button is-primary is-medium">
                Add a recipe!
              </button>
            </Link>
          </div>
        ) : (
          <>
            <SearchRecipesInput
              searchVal={searchVal}
              filterRecipesBySearch={filterRecipesBySearch}
            />
            <FilterRecipesTabs
              activeTab={activeTab}
              changeActiveTab={changeActiveTab}
            />
          </>
        )}

        <div className="columns is-multiline is-justify-content-center mt-3">
          {Boolean(recipes.length && !filteredRecipes.length) && (
            <p className="title">No recipes found.</p>
          )}
          {filteredRecipes.map((recipe, index) => {
            return (
              <div
                className="column is-one-quarter-desktop is-half-tablet"
                key={index}
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
