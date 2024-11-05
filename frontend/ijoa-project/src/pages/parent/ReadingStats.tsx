import { useEffect, useState } from "react";
import Histogram from "../../components/parent/stats/Histogram";
import PieChart from "../../components/parent/stats/PieChart";
import { parentApi } from "../../api/parentApi";
import { ChildInfo } from "../../types/parentTypes";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import ReadingReport from "../../components/parent/stats/ReadingReport";
import WordCloud from "../../components/parent/stats/WordCloud";

const ReadingStats = () => {
  const filterText = ["일자", "요일", "시간"];
  const [selectHistogramFilter, setSelectHistogramFilter] = useState("시간");
  const [childList, setChildList] = useState<ChildInfo[] | null>(null);
  const [selectChild, setSelectChild] = useState<ChildInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [maxCategory, setMaxCategory] = useState<string | null>(null);

  // 자녀 프로필 목록 조회 API 통신 함수
  const getChildInfoList = async () => {
    try {
      setIsLoading(true);
      const response = await parentApi.getChildList();
      if (response.status === 200) {
        setChildList(response.data);
        setSelectChild(response.data[0]);
      }
    } catch (error) {
      console.log("parentApi의 getChildList : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getChildInfoList();
  }, []);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (!selectChild || !childList || childList?.length === 0) {
    return (
      <div className="h-screen px-20 pt-28 pb-10 flex justify-center items-center">
        <p>먼저 자녀 프로필을 만들어 주세요!</p>
      </div>
    );
  }

  return (
    <div className="h-screen px-20 pt-28 pb-10 grid grid-rows-2 gap-3">
      {/* 상단 내용 */}
      <div className="grid grid-cols-[1fr_4fr_2fr] gap-3">
        <div className="flex flex-col justify-center items-center space-y-3">
          <img
            className="w-3/4 aspect-1 bg-white rounded-full border object-cover"
            src={selectChild.profileUrl}
            alt=""
          />

          <p className="text-lg font-bold">
            {selectChild.name} / 만 {selectChild.age}세
          </p>

          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1">
              자녀 선택
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              {childList?.map((child, index) => (
                <li key={index} onClick={() => setSelectChild(child)}>
                  <a>
                    {child.name} / 만 {child.age}세
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

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
          <Histogram childId={selectChild.childId} filter={selectHistogramFilter} />
        </div>

        {/* 도넛형 차트 */}
        <div className="flex flex-col space-y-3">
          <p className="text-xl font-semibold">
            <span className="text-3xl text-[#F26172] font-semibold">{maxCategory}</span> 유형이 좋아요!
          </p>
          <PieChart childId={selectChild.childId} setMaxCategory={setMaxCategory} />
        </div>
      </div>

      {/* 하단 내용 */}
      <div className="grid grid-cols-[5fr_2fr] gap-3">
        {/* 분석 보고서 */}
        <ReadingReport childId={selectChild.childId} />

        {/* 워드 클라우드 */}
        <WordCloud />
      </div>
    </div>
  );
};

export default ReadingStats;
