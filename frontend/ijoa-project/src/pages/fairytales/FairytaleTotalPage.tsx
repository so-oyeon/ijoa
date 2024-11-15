import React, { useState } from "react";
import "../../css/FairytaleContentPage.css";
import FairytaleListPage from "./FairytaleListPage";
import FairytaleSearchPage from "./FairytaleSearchPage";

const FairytaleTotalPage: React.FC = () => {
  const [showList, setShowList] = useState(true);

  return (
    <div className="fairytale-content-page mt-[100px] font-['MapleLight']">
      {/* Toggle Tabs */}
      <div role="tablist" className="tabs tabs-boxed w-[200px] ml-auto mr-12 flex justify-end">
        <a
          role="tab"
          className={`tab ${
            showList ? "tab-active text-xl" : "text-md"
          }`}
          onClick={() => setShowList(true)}
        >
          추천 도서
        </a>
        <a
          role="tab"
          className={`tab ${
            !showList ? "tab-active text-xl" : "text-md"
          }`}
          onClick={() => setShowList(false)}
        >
          전체 도서
        </a>
      </div>

      {/* Conditional Rendering */}
      {showList ? <FairytaleListPage /> : <FairytaleSearchPage />}
    </div>
  );
};

export default FairytaleTotalPage;
