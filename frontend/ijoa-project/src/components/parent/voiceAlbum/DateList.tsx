import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

const DateList = () => {
  const yearList = ["24", "23", "22"];
  const [selectYear, setSelectYear] = useState<string | null>("24");
  const [selectMonth, setSelectMonth] = useState("12");
  const yearRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 년도 선택 핸들러
  const handleYear = (year: string) => {
    if (selectYear === year) {
      setSelectYear(null);
    } else {
      setSelectYear(year);
    }
    setSelectMonth("12");
  };

  // 월 선택 핸들러
  const handleMonth = (month: string) => {
    setSelectMonth(month);
  };

  // 년도 선택 시 스크롤이 항상 년도에서 시작되도록
  useEffect(() => {
    if (selectYear && yearRefs.current[selectYear]) {
      yearRefs.current[selectYear]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectYear]);

  return (
    <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
      <hr className="my-3 bg-[#9E9E9E]" />

      {yearList.map((year, index) => (
        <div key={index}>
          {/* 년도 */}
          <div>
            <div
              className="p-2 flex justify-between items-center"
              onClick={() => handleYear(year)}
              ref={(el) => (yearRefs.current[year] = el)}>
              <p className="text-xl font-semibold text-[#565656]">20{year}년</p>
              {selectYear === `${year}` ? <IoIosArrowDown className="text-2xl text-[#565656]" /> : <></>}
            </div>
            {/* 구분선 */}
            <hr className="my-3 bg-[#9E9E9E]" />
          </div>

          {/* 월 */}
          <div>
            {selectYear === year &&
              Array.from({ length: 12 }, (_, i) => 12 - i).map((month, index) => (
                <div key={index}>
                  <div
                    className={`px-5 py-2 ${
                      selectMonth === `${month}` ? "bg-[#FFF3D0] rounded-lg" : ""
                    } flex justify-between items-center`}
                    onClick={() => handleMonth(`${month}`)}>
                    <p
                      className={`text-lg font-semibold ${
                        selectMonth === `${month}` ? "text-[#565656]" : "text-[#9E9E9E]"
                      }`}>
                      {year}년 {month}월
                    </p>
                    {selectMonth === `${month}` ? <IoIosArrowForward className="text-2xl text-[#FC9B35]" /> : <></>}
                  </div>
                  {/* 구분선 */}
                  <hr className="my-3 bg-[#9E9E9E]" />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DateList;
