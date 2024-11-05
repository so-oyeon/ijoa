import { useEffect, useState } from "react";
import Histogram from "../../components/parent/stats/Histogram";
import PieChart from "../../components/parent/stats/PieChart";
import { GoDotFill } from "react-icons/go";
import { parentApi } from "../../api/parentApi";
import { ChildInfo } from "../../types/parentTypes";
import LoadingAnimation from "../../components/common/LoadingAnimation";

const ReadingStats = () => {
  const filterText = ["일자", "요일", "시간"];
  const [selectHistogramFilter, setSelectHistogramFilter] = useState("시간");
  const [childList, setChildList] = useState<ChildInfo[] | null>(null);
  const [selectChild, setSelectChild] = useState<ChildInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [maxCategory, setMaxCategory] = useState<string | null>(null);

  const analysisText = [
    "긴 문장이 많거나 텍스트가 복잡한 경우 집중도가 떨어집니다.",
    "평균 7분을 넘기면 집중력 저하가 두드러집니다.",
    "대답하는 것을 좋아하고, 대답 내용이 매우 구체적입니다.",
  ];

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
            src="/assets/profile-img-girl.png"
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
        <div className="grow p-5 border-4 border-[#F5F5F5] rounded-2xl flex flex-col justify-between">
          <p className="text-xl font-semibold">
            다솔이의&nbsp;
            <span className="underline underline-offset-[-3px] decoration-8 decoration-[#FDC94F]">독서 분석</span>
            &nbsp;보고서
          </p>

          <div className="grid gap-1">
            {analysisText.map((text, index) => (
              <div className="text-[#565656] flex items-center space-x-3" key={index}>
                <GoDotFill />
                <p className="font-semibold">{text}</p>
              </div>
            ))}
          </div>

          <p className="p-5 text-[#565656] text-center font-semibold bg-[#FFEEC6] rounded-full">
            짧고 흥미로운 문장을 읽을 때 집중력이 높으니, 5세 대상의 동화책을 추천합니다.
            <br /> 주로 오전 시간대에 집중력이 높으므로, 어려운 내용의 책은 오전에 읽도록 유도해 주세요.
          </p>
        </div>

        {/* 타이포그래피 */}
        <div className="pt-5 flex flex-col relative">
          <div className="grow p-3 border-4 border-[#F5F5F5] rounded-2xl">
            <p className="w-2/3 py-2 text-center font-semibold bg-[#B1EBAB] rounded-full absolute top-0 left-1/2 transform -translate-x-1/2">
              이런 책이 재밌어요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingStats;
