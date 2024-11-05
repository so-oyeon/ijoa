import { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { parentApi } from "../../../api/parentApi";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";

interface Props {
  childId: number;
}

const ReadingReport = ({ childId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<string | null>(null);
  const [reportDataList, setReportDataList] = useState<string[] | null>(null);

  // 독서 분석 보고서 조회 통신 함수
  const getReadingReportData = async () => {
    try {
      setIsLoading(true);
      const response = await parentApi.getReadingReport(childId);
      if (response.status === 200) {
        setReportData(response.data.report);
      }
    } catch (error) {
      console.log("");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getReadingReportData();
  }, []);

  useEffect(() => {
    if (!reportData) return;

    setReportDataList(reportData.split("- ").filter((item) => item !== ""));
    console.log(reportData.split("- ").filter((item) => item !== ""));
  }, [reportData]);

  if (!reportDataList || isLoading) {
    return (
      <div className="grow border-4 border-[#F5F5F5] rounded-2xl flex justify-center items-center">
        <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
      </div>
    );
  }

  return (
    <div className="grow p-5 border-4 border-[#F5F5F5] rounded-2xl flex flex-col justify-between">
      <p className="text-xl font-semibold">
        <span className="underline underline-offset-[-3px] decoration-8 decoration-[#FDC94F]">독서 분석</span>
        &nbsp;보고서
      </p>

      <div className="grid gap-1">
        {reportDataList.map((text, index) => (
          <div className="text-[#565656] grid grid-cols-[1fr_19fr]" key={index}>
            <div className="flex items-center">
              <GoDotFill />
            </div>
            <p className="font-semibold">{text}</p>
          </div>
        ))}
      </div>

      <p className="px-5 py-3 text-[#565656] text-center font-semibold bg-[#FFEEC6] rounded-full">
        짧고 흥미로운 문장을 읽을 때 집중력이 높으니, 5세 대상의 동화책을 추천합니다.
        <br /> 주로 오전 시간대에 집중력이 높으므로, 어려운 내용의 책은 오전에 읽도록 유도해 주세요.
      </p>
    </div>
  );
};

export default ReadingReport;
