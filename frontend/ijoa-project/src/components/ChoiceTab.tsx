import React, { useState } from "react";

interface ChoiceTabProps {
  tabs: string[];
}

const ChoiceTab: React.FC<ChoiceTabProps> = ({ tabs }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div role="tablist" className="tabs tabs-bordered">
      {tabs.map((tab, index) => (
        <a 
          key={index} 
          role="tab" 
          className={`tab ${activeTabIndex === index ? "font-bold tab-active border-b-2" : "font-bold text-gray-400"}`} 
          onClick={() => setActiveTabIndex(index)}
        >
          {tab}
        </a>
      ))}
    </div>
  );
};

export default ChoiceTab;
