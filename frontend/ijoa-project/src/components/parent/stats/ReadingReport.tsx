import { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { parentApi } from "../../../api/parentApi";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";
import { ReadingReportInfo } from "../../../types/parentTypes";

interface Props {
  childId: number;
}

const ReadingReport = ({ childId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<ReadingReportInfo | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  // 독서 분석 보고서 조회 통신 함수
  const getReadingReportData = async () => {
    try {
      setIsLoading(true);
      const response = await parentApi.getReadingReport(childId);
      if (response.status === 200) {
        setReportData(response.data);
      } else if (response.status === 204) {
        setReportData(null);
      }
      setResponseStatus(response.status);
    } catch (error) {
      console.log("parentApi의 parentApi : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getReadingReportData();
  }, [childId]);

  if (!reportData || isLoading) {
    return (
      <div className="grow border-4 border-[#F5F5F5] rounded-2xl flex flex-col justify-center items-center">
        <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
        <p>
          {responseStatus === 204 ? "조회된 데이터가 없습니다. 책을 먼저 읽어주세요!" : "데이터를 조회하고 있어요."}
        </p>
      </div>
    );
  }

  return (
    <div className="grow px-5 border-4 border-[#F5F5F5] rounded-2xl overflow-y-auto">
      <p className="py-3 text-xl font-semibold bg-white sticky top-0 z-30">
        <span className="underline underline-offset-[-3px] decoration-8 decoration-[#FDC94F]">독서 분석</span>
        &nbsp;보고서
      </p>

      <div className="grid gap-1">
        <div className="grid gap-1">
          <div className="text-[#565656] grid grid-cols-[1fr_19fr]">
            <div className="flex items-center">
              <GoDotFill />
            </div>
            <p className="font-semibold">{reportData.gazeDistributionAnalysis}</p>
          </div>
        </div>

        <div className="grid gap-1">
          <div className="text-[#565656] grid grid-cols-[1fr_19fr]">
            <div className="flex items-center">
              <GoDotFill />
            </div>
            <p className="font-semibold">{reportData.timeOfDayAttentionAnalysis}</p>
          </div>
        </div>

        <div className="grid gap-1">
          <div className="text-[#565656] grid grid-cols-[1fr_19fr]">
            <div className="flex items-center">
              <GoDotFill />
            </div>
            <p className="font-semibold">{reportData.textLengthAnalysis}</p>
          </div>
        </div>
      </div>

      <p className="mt-3 px-10 py-5 text-[#565656] text-justify font-semibold bg-[#FFEEC6] rounded-full break-keep">
        {reportData.conclusion}
      </p>

      <div className="pb-3 bg-white sticky bottom-0 z-30"></div>
    </div>
  );
};

export default ReadingReport;
