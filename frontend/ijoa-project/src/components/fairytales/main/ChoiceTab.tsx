import React from "react";

interface TabItem {
  id: string;
  name: string;
  shortName: string;
}

interface ChoiceTabProps {
  tabs: TabItem[];
  onTabClick: (categoryId: string) => void;
}

const ChoiceTab: React.FC<ChoiceTabProps> = ({ tabs, onTabClick }) => {
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
    onTabClick(tabs[index].id);
  };

  return (
    <div role="tablist" className="tabs tabs-bordered w-full sm:w-[400px] md:w-[500px] lg:w-[600px]">
      {tabs.map((tab, index) => (
        <a
          key={tab.id}
          role="tab"
          className={`tab px-4 py-2 ${
            activeTabIndex === index
              ? "font-['MapleLight'] text-base sm:text-lg md:text-xl font-bold tab-active border-b-2"
              : "font-['MapleLight'] text-sm sm:text-base md:text-lg font-bold text-gray-500"
          }`}
          onClick={() => handleTabClick(index)}
        >
          <span className="block lg:hidden">{tab.shortName}</span>
          <span className="hidden lg:block">{tab.name}</span>
        </a>
      ))}
    </div>
  );
};

export default ChoiceTab;
