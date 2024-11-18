import { useEffect, useState } from "react";
import Histogram from "../../components/parent/stats/Histogram";
import PieChart from "../../components/parent/stats/PieChart";
import { parentApi } from "../../api/parentApi";
import { ChildInfo } from "../../types/parentTypes";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import ReadingReport from "../../components/parent/stats/ReadingReport";
import WordCloud from "../../components/parent/stats/WordCloud";
import ChildDropDown from "../../components/parent/ChildDropDown";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

const ReadingStats = () => {
  const filterText = ["1일", "1주일", "1달", "1년"];
  const [selectHistogramFilter, setSelectHistogramFilter] = useState("1달");
  const [childList, setChildList] = useState<ChildInfo[] | null>(null);
  const [selectChild, setSelectChild] = useState<ChildInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [maxCategory, setMaxCategory] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜 관리
  const [formattedDate, setFormattedDate] = useState(""); // 표시용 날짜 텍스트
  const [apiDate, setApiDate] = useState(""); // API 통신용 날짜 텍스트

  // 현재 날짜와 필터에 따라 날짜 텍스트 계산
  const calculateDates = () => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const date = String(currentDate.getDate()).padStart(2, "0");

    switch (selectHistogramFilter) {
      case "1일":
        setFormattedDate(`${parseInt(date)}일`);
        setApiDate(`${year}-${month}-${date}`);
        break;

      case "1주일": {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - 6); // 1주일 전 날짜로 설정

        // 시작 날짜의 연도, 월, 일 가져오기
        const startYear = startOfWeek.getFullYear();
        const startMonth = String(startOfWeek.getMonth() + 1).padStart(2, "0");
        const startDate = String(startOfWeek.getDate()).padStart(2, "0");

        // 현재 날짜의 월, 일 가져오기
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
        const currentDateFormatted = String(currentDate.getDate()).padStart(2, "0");

        // 포맷팅된 날짜 설정
        setFormattedDate(`${startMonth}/${startDate}~${currentMonth}/${currentDateFormatted}`);

        // API에 사용할 주 시작 날짜 설정
        setApiDate(`${startYear}-${startMonth}-${startDate}`);
        break;
      }

      case "1달":
        setFormattedDate(`${parseInt(month)}월`);
        setApiDate(`${year}-${month}-01`);
        break;

      case "1년":
        setFormattedDate(`${year}년`);
        setApiDate(`${year}-01-01`);
        break;

      default:
        break;
    }
  };

  // 날짜 증가/감소
  const adjustDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);

    switch (selectHistogramFilter) {
      case "1일":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "1주일":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "1달":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
      case "1년":
        newDate.setFullYear(newDate.getFullYear() + (direction === "next" ? 1 : -1));
        break;
      default:
        break;
    }

    setCurrentDate(newDate);
  };

  // 자녀 프로필 목록 조회 API 통신 함수
  const getChildInfoList = async () => {
    try {
      setIsLoading(true);
      const response = await parentApi.getChildProfileList();
      if (response.status === 200) {
        setChildList(response.data);
        setSelectChild(response.data[0]);
      }
    } catch (error) {
      console.log("parentApi의 getChildProfileList : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getChildInfoList();
  }, []);

  useEffect(() => {
    calculateDates();
  }, [currentDate, selectHistogramFilter]);

  useEffect(() => {
    setCurrentDate(new Date());
  }, [selectHistogramFilter]);

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
    <div className="h-screen px-20 pt-24 pb-10 grid grid-rows-2 gap-3 font-['IMBold']">
      {/* 상단 내용 */}
      <div className="grid grid-cols-[1fr_4fr_2fr] gap-3">
        <div className="flex flex-col justify-center items-center space-y-3 relative z-40">
          <img
            className="w-3/4 aspect-1 bg-white rounded-full border object-cover"
            src={selectChild.profileUrl}
            alt=""
          />

          <p className="text-lg font-bold">
            {selectChild.name} / 만 {selectChild.age}세
          </p>

          <ChildDropDown childList={childList} setSelectChild={setSelectChild} />
        </div>

        {/* 히스토그램 차트 */}
        <div className="flex flex-col space-y-3">
          <div className="grid grid-cols-3">
            {/* 읽은 책 수 */}
            <p className="text-xl font-semibold">
              자녀가&nbsp;
              <span className="text-3xl text-[#24A994] font-semibold">책</span>을 읽은 시간!
            </p>

            {/* 날짜 정보 */}
            <div className="flex justify-center items-center space-x-3">
              <BiSolidLeftArrow
                className={`text-xl text-[#9e9e9e] cursor-pointer`}
                onClick={() => adjustDate("prev")}
              />
              <p className="text-xl font-semibold">{formattedDate}</p>
              <BiSolidRightArrow
                className={`text-xl text-[#9e9e9e] cursor-pointer`}
                onClick={() => adjustDate("next")}
              />
            </div>

            {/* 기간 버튼바 */}
            <div className="border border-[#A6AEFE] rounded-sm grid grid-cols-4">
              {filterText.map((text, index) => (
                <button
                  className={`px-3=2 py-1 font-semibold ${
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
          <Histogram childId={selectChild.childId} filter={selectHistogramFilter} apiDate={apiDate} />
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
        <WordCloud childId={selectChild.childId} />
      </div>
    </div>
  );
};

export default ReadingStats;
