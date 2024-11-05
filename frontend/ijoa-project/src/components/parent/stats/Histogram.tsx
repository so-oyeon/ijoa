import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { parentApi } from "../../../api/parentApi";
import { FocusTimeUnitInfo } from "../../../types/parentTypes";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";

interface Props {
  childId: number;
  filter: string;
}

const HistogramChart = ({ childId, filter }: Props) => {
  const [data, setData] = useState<FocusTimeUnitInfo[] | null>(null);
  const [dataType, setDataType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getFocusTimeData = async () => {
    if (!dataType) return;

    try {
      setIsLoading(true);
      const response = await parentApi.getFocusTimeData(childId, dataType);
      if (response.status === 200) {
        setData(response.data.result);
        console.log(response);
      }
    } catch (error) {
      console.log("parentApi의 getFocusTimeData : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!dataType) return;

    getFocusTimeData();
  }, [dataType]);

  useEffect(() => {
    switch (filter) {
      case "일자":
        setDataType("date");
        break;
      case "요일":
        setDataType("day");
        break;
      case "시간":
        setDataType("hour");
        break;
    }
  }, [filter]);

  if (!data || isLoading) {
    return (
      <div className="grow border-4 border-[#F5F5F5] rounded-2xl flex justify-center items-center">
        <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
      </div>
    );
  }

  const categories = data.map((item) => item.unit);
  const seriesData = data.map((item) => item.avgAttentionRate);

  // 상위 5개의 막대 색상을 적용하기 위해 데이터를 정렬하고, 상위 5개의 기준값을 계산
  const sortedData = [...seriesData].sort((a, b) => b - a);
  const threshold = sortedData[4]; // 상위 5번째 값

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false, // 오른쪽 상단 햄버거 버튼(툴바) 숨기기
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 7, // 막대 상단에만 적용되는 둥근 모서리
        borderRadiusApplication: "end", // 상단에만 borderRadius 적용
        horizontal: false,
        columnWidth: "60%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
    },
    yaxis: {
      show: false,
      min: 0,
      max: Math.max(...seriesData), // y축 최댓값을 데이터의 가장 큰 값으로 설정
      labels: {
        formatter: (value: number) => {
          // y축 라벨에서 0과 최댓값만 표시
          return value === 0 || value === Math.max(...seriesData) ? value.toString() : "";
        },
      },
    },
    grid: {
      show: false,
    },
    legend: {
      show: false,
    },
    fill: {
      opacity: 3,
    },
    colors: seriesData.map((value) => (value >= threshold ? "#ABAFFF" : "#F0EFF6")),
  };

  const series = [
    {
      name: "Value",
      data: seriesData,
    },
  ];

  return (
    <div className="grow border-4 border-[#F5F5F5] rounded-2xl">
      {/* 그래프의 전체 가로 너비 설정 */}
      <Chart options={chartOptions} series={series} type="bar" height="100%" />
    </div>
  );
};

export default HistogramChart;
