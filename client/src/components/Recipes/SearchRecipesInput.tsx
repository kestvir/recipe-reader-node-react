import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchRecipesInputProps {
  searchVal: string;
  filterRecipesBySearch: (searchVal: string) => void;
}

const SearchRecipesInput: React.FC<SearchRecipesInputProps> = ({
  searchVal,
  filterRecipesBySearch,
}) => {
  return (
    <div className="column is-half is-offset-one-quarter">
      <div className="field">
        <div className="control has-icons-right">
          <input
            value={searchVal}
            onChange={(e) => filterRecipesBySearch(e.target.value)}
            className="input is-medium"
            type="text"
            placeholder="Search for recipes..."
          />
          <span className="icon is-right">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchRecipesInput;
