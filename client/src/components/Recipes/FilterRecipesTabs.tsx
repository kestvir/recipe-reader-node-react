import React from "react";

interface FilterRecipesTabsProps {
  activeTab: string;
  changeActiveTab: (tab: string) => void;
}

const TABS = ["All", "Entree", "Main", "Desert"];

const FilterRecipesTabs: React.FC<FilterRecipesTabsProps> = ({
  activeTab,
  changeActiveTab,
}) => {
  return (
    <div className="tabs is-toggle is-fullwidth is-large">
      <ul>
        {TABS.map((tab, index) => {
          return (
            <li
              className={activeTab === tab ? "is-active" : ""}
              key={index}
              onClick={() => changeActiveTab(tab)}
            >
              <a>
                <span>{tab}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FilterRecipesTabs;
