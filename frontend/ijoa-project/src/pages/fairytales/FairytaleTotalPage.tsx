import React, { useState } from "react";
import "../../css/FairytaleContentPage.css";
import FairytaleListPage from "./FairytaleListPage";
import FairytaleSearchPage from "./FairytaleSearchPage";

const FairytaleTotalPage: React.FC = () => {
  const [showList, setShowList] = useState(true);

  return (
    <div className="fairytale-content-page mt-[100px] font-['MapleLight']">
      {/* Toggle Tabs */}
      <div className="border border-[#FFCC00] rounded-sm grid grid-cols-2 w-[230px] ml-auto mr-12 justify-end text-lg">
        <button
          className={`px-3 py-1 font-semibold ${
            showList ? "text-white bg-[#FFCC00]" : "text-[#FFCC00]"
          }`}
          onClick={() => setShowList(true)}
        >
          추천 도서
        </button>
        <button
          className={`px-3 py-1 font-semibold ${
            !showList ? "text-white bg-[#FFCC00]" : "text-[#FFCC00]"
          }`}
          onClick={() => setShowList(false)}
        >
          전체 도서
        </button>
      </div>

      {/* Conditional Rendering */}
      {showList ? <FairytaleListPage /> : <FairytaleSearchPage />}
    </div>
  );
};

export default FairytaleTotalPage;
