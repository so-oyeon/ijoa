import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { CategoriesUnitInfo } from "../../../types/parentTypes";
import { parentApi } from "../../../api/parentApi";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";

interface Props {
  childId: number;
  setMaxCategory: (category: string) => void;
}

const PieChart = ({ childId, setMaxCategory }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CategoriesUnitInfo[] | null>(null);
  const [series, setSeries] = useState<number[] | null>(null);
  const categories = ["의사소통", "자연과학", "사회관계", "예술경험", "신체운동/건강"];

  // 도넛형 차트 분야별 독서 통계 조회 통신 함수
  const getCategoriesData = async () => {
    try {
      setIsLoading(true);
      const response = await parentApi.getCategoriesData(childId);
      if (response.status === 200) {
        setData(response.data);
      } else if (response.status === 204) {
        setData([]);
      }
    } catch (error) {
      console.log("parentApi의 getCategoriesData : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 렌더링 시, 통계 데이터 조회
  useEffect(() => {
    getCategoriesData();
  }, [childId]);

  useEffect(() => {
    if (!data) return;

    // 각 데이터의 값
    setSeries(data.map((item) => item.count));
  }, [data]);

  useEffect(() => {
    if (!series) return;

    // 가장 좋은 책 분야
    setMaxCategory(categories[series.indexOf(Math.max(...series))]);
  }, [series]);

  if (!series || isLoading) {
    return (
      <div className="grow border-4 border-[#F5F5F5] rounded-2xl flex flex-col justify-center items-center">
        <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
        <p>데이터를 조회하고 있어요.</p>
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <div className="grow border-4 border-[#F5F5F5] rounded-2xl flex flex-col justify-center items-center">
        <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
        <p>조회된 데이터가 없습니다.</p>
      </div>
    );
  }

  // 차트 데이터와 설정 옵션
  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["의사소통", "자연탐구", "사회관계", "예술경험", "신체운동/건강"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    plotOptions: {
      pie: {
        donut: {
          size: "50%", // 도넛의 굵기를 조정
        },
      },
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: ["#333333"], // 원하는 색상으로 퍼센트 라벨 색상 설정
        fontSize: "14px", // 원하는 글자 크기로 설정
      },
      dropShadow: {
        enabled: false, // 그림자 비활성화
      },
    },
    legend: {
      show: true,
      position: "bottom",
    },
    colors: ["#A0DFCE", "#9FA2FF", "#D79AD6", "#FEAAB9", "#F1C681"],
  };

  return (
    <div className="grow p-3 border-4 border-[#F5F5F5] rounded-2xl flex items-center">
      <Chart options={chartOptions} series={series} type="donut" height="100%" />
    </div>
  );
};

export default PieChart;
