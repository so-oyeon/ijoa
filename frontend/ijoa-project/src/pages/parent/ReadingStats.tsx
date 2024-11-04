import { useState } from "react";
import Histogram from "../../components/parent/stats/Histogram";
import PieChart from "../../components/parent/stats/PieChart";

const ReadingStats = () => {
  const filterText = ["일자", "요일", "시간"];
  const [selectHistogramFilter, setSelectHistogramFilter] = useState("시간");

  return (
    <div className="px-20 pt-28 pb-10 h-screen">
      <div className="h-1/2 grid grid-cols-[1fr_4fr_2fr] gap-3">
        <div></div>

        {/* 히스토그램 차트 */}
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between">
            {/* 읽은 책 수 */}
            <p className="text-xl font-semibold">
              지금까지 <span className="text-3xl text-[#24A994] font-semibold">13권</span> 읽었어요!
            </p>

            {/* 기간 버튼바 */}
            <div className="border border-[#A6AEFE] rounded-sm grid grid-cols-3">
              {filterText.map((text, index) => (
                <button
                  className={`px-3 py-1 font-semibold ${
                    selectHistogramFilter === text ? "text-white bg-[#A6AEFE]" : "text-[#A6AEFE]"
                  }`}
                  onClick={() => setSelectHistogramFilter(text)}
                  key={index}>
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* 히스토그램 */}
          <Histogram />
        </div>

        {/* 도넛형 차트 */}
        <div className="flex flex-col space-y-3">
          <p className="text-xl font-semibold">
            <span className="text-3xl text-[#F26172] font-semibold">자연탐구</span> 유형이 좋아요!
          </p>
          <PieChart />
        </div>
      </div>
    </div>
  );
};

export default ReadingStats;
