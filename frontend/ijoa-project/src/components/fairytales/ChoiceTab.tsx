import React from "react";

interface TabItem {
  id: string;
  name: string;
}

interface ChoiceTabProps {
  tabs: TabItem[];
  onTabClick: (categoryId: string) => void; // categoryId 타입을 string으로 변경
}

const ChoiceTab: React.FC<ChoiceTabProps> = ({ tabs, onTabClick }) => {
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
    onTabClick(tabs[index].id); // 이제 오류가 발생하지 않습니다.
  };

  return (
    <div role="tablist" className="tabs tabs-bordered">
      {tabs.map((tab, index) => (
        <a
          key={tab.id}
          role="tab"
          className={`tab ${activeTabIndex === index ? "font-['IMRegular'] text-xl font-bold tab-active border-b-2" : "font-['IMRegular'] text-md font-bold text-gray-500"}`}
          onClick={() => handleTabClick(index)}
        >
          {tab.name}
        </a>
      ))}
    </div>
  );
};

export default ChoiceTab;
