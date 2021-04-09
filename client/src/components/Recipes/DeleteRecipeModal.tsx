import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { deleteRecipe, resetReqState } from "../../redux/slices/recipesSlice";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { State } from "../../shared/types";

interface DeletRecipeModalProps {
  closeModal: () => void;
  recipeTitle: string;
}

interface Params {
  id: string;
}

const DeletRecipeModal: React.FC<DeletRecipeModalProps> = ({
  closeModal,
  recipeTitle,
}) => {
  const { isLoading, isSuccess } = useAppSelector(
    (state: State) => state.recipes
  );
  const dispatch = useAppDispatch();

  const history = useHistory();
  const params: Params = useParams();

  useEffect(() => {
    if (isSuccess) {
      history.push("/");
    }
    return () => {
      dispatch(resetReqState());
    };
  }, [isSuccess]);

  const handleDeleteRecipe = () => {
    dispatch(deleteRecipe(params.id));
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal}></div>
      <div className="modal-content">
        <div className="box">
          <div className="block">
            <h4 className="title is-4">Delete Recipe</h4>
            <p className="is-size-5">
              Are you sure you want to delete the recipe: {recipeTitle}?
            </p>
          </div>
          <div className="block">
            <div className="buttons are-medium is-flex is-justify-content-center">
              <button className="button is-black" onClick={closeModal}>
                No
              </button>
              <button
                className={`button is-primary ${isLoading && "is-loading"}`}
                onClick={handleDeleteRecipe}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={closeModal}
      ></button>
    </div>
  );
};
export default DeletRecipeModal;
