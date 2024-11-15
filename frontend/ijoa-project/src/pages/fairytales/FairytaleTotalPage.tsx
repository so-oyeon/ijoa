import React, { useState } from "react";
import "../../css/FairytaleContentPage.css";
import FairytaleListPage from "./FairytaleListPage";
import FairytaleSearchPage from "./FairytaleSearchPage";

const FairytaleTotalPage: React.FC = () => {
  const [showList, setShowList] = useState(true); // true for List, false for Search

  return (
    <div className="fairytale-content-page mt-24 font-['MapleLight'] text-3xl ">
      {/* Toggle Tabs */}
      <div role="tablist" className="tabs tabs-lifted ">
        <a
          role="tab"
          className={`tab ${showList ? "tab-active text-3xl [--tab-bg:yellow] [--tab-border-color:orange]" : "text-2xl"}`}
          onClick={() => setShowList(true)}
        >
          추천 도서
        </a>
        <a
          role="tab"
          className={`tab ${!showList ? "tab-active text-3xl [--tab-bg:yellow] [--tab-border-color:orange]" : "text-2xl"}`}
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
