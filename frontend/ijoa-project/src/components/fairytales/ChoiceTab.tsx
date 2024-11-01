import React from "react";

interface TabItem {
  id: number;
  name: string;
}

interface ChoiceTabProps {
  tabs: TabItem[];
  onTabClick: (categoryId: number) => void;
}

const ChoiceTab: React.FC<ChoiceTabProps> = ({ tabs, onTabClick }) => {
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
    onTabClick(tabs[index].id);
  };

  return (
    <div role="tablist" className="tabs tabs-bordered">
      {tabs.map((tab, index) => (
        <a
          key={tab.id}
          role="tab"
          className={`tab ${activeTabIndex === index ? "font-bold tab-active border-b-2" : "font-bold text-gray-400"}`}
          onClick={() => handleTabClick(index)}
        >
          {tab.name}
        </a>
      ))}
    </div>
  );
};

export default ChoiceTab;
