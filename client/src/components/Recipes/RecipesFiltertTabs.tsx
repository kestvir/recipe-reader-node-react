import React from "react";

interface RecipesFiltertTabsProps {
  activeTab: string;
  changeActiveTab: (tab: string) => void;
}

const TABS = ["All", "Entree", "Main", "Desert"];

const RecipesFiltertTabs: React.FC<RecipesFiltertTabsProps> = ({
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

export default RecipesFiltertTabs;
