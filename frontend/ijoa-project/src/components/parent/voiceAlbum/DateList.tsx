import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

interface Props {
  setSelectStartDate: (date: string) => void;
  setSelectEndDate: (date: string) => void;
}

const DateList = ({ setSelectStartDate, setSelectEndDate }: Props) => {
  const today = new Date();
  const yearList = ["24", "23", "22"];
  const [selectYear, setSelectYear] = useState<string | null>(String(today.getFullYear()).slice(2));
  const [selectMonth, setSelectMonth] = useState(String(today.getMonth() + 1).padStart(2, "0"));
  const yearRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 년도 선택 핸들러
  const handleYear = (year: string) => {
    setSelectYear(selectYear === year ? null : year);
    setSelectMonth("12");
  };

  // 월 선택 핸들러
  const handleMonth = (month: string) => {
    setSelectMonth(month.padStart(2, "0"));
  };

  // 년도 선택 시 스크롤이 항상 년도에서 시작되도록
  useEffect(() => {
    if (selectYear && yearRefs.current[selectYear]) {
      yearRefs.current[selectYear]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectYear]);

  // 년도와 월이 바뀔 때마다 날짜를 "yyyy-MM-dd" 형식으로 설정
  useEffect(() => {
    if (selectYear && selectMonth) {
      const startDate = `20${selectYear}-${selectMonth}-01`;
      const lastDayOfMonth = new Date(Number(`20${selectYear}`), Number(selectMonth), 0).getDate(); // 월의 마지막 날짜 계산
      const endDate = `20${selectYear}-${selectMonth}-${String(lastDayOfMonth).padStart(2, "0")}`;

      setSelectStartDate(startDate);
      setSelectEndDate(endDate);
    }
  }, [selectYear, selectMonth]);

  return (
    <div className="h-80 overflow-y-auto">
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
              Array.from({ length: 12 }, (_, i) => 12 - i).map((month) => {
                const monthStr = String(month).padStart(2, "0");
                return (
                  <div key={month}>
                    <div
                      className={`px-5 py-2 ${
                        selectMonth === monthStr ? "bg-[#FFF3D0] rounded-lg" : ""
                      } flex justify-between items-center`}
                      onClick={() => handleMonth(monthStr)}>
                      <p
                        className={`text-lg font-semibold ${
                          selectMonth === monthStr ? "text-[#565656]" : "text-[#9E9E9E]"
                        }`}>
                        {year}년 {monthStr}월
                      </p>
                      {selectMonth === monthStr ? <IoIosArrowForward className="text-2xl text-[#FC9B35]" /> : null}
                    </div>
                    <hr className="my-3 bg-[#9E9E9E]" />
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DateList;
