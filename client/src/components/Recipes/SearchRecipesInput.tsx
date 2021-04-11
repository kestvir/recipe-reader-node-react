import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchRecipesInputProps {
  searchVal: string;
  setSearchVal: React.Dispatch<React.SetStateAction<string>>;
}

const SearchRecipesInput: React.FC<SearchRecipesInputProps> = ({
  searchVal,
  setSearchVal,
}) => {
  return (
    <div className="columns">
      <div className="column is-half is-offset-one-quarter">
        <div className="field">
          <div className="control has-icons-right">
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
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
    </div>
  );
};

export default SearchRecipesInput;
