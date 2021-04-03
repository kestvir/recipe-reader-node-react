import React, { useEffect, useState } from "react";
import { dishCategories } from "../../../utils/constants";
import ErrorMessage from "../../UI/ErrorMessage";

interface SelectCategoryProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string;
  displayErrors: boolean;
}

const SelectCategory: React.FC<SelectCategoryProps> = ({
  category,
  setCategory,
  errorMessage,
  displayErrors,
}) => {
  const [hideErrorStyles, setHideErrorStyles] = useState(true);

  useEffect(() => {
    setHideErrorStyles(!displayErrors);
  }, [displayErrors]);

  return (
    <div className="field">
      <label className="label">Select a category</label>
      <div className="control">
        <div className="select">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {dishCategories.map((category) => {
              return <option key={category}>{category}</option>;
            })}
          </select>
        </div>
      </div>
      <ErrorMessage message={errorMessage} hideErrorMessage={hideErrorStyles} />
    </div>
  );
};

export default SelectCategory;
