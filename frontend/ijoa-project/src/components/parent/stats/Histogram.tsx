import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

interface Props {
  filter: string;
}

const HistogramChart = ({ filter }: Props) => {
  const montlyData = [
    { time: "1", value: 42 },
    { time: "2", value: 23 },
    { time: "3", value: 13 },
    { time: "4", value: 13 },
    { time: "5", value: 33 },
    { time: "6", value: 13 },
    { time: "7", value: 32 },
    { time: "8", value: 94 },
    { time: "9", value: 67 },
    { time: "10", value: 30 },
    { time: "11", value: 30 },
    { time: "12", value: 110 },
    { time: "13", value: 62 },
    { time: "14", value: 35 },
    { time: "15", value: 30 },
    { time: "16", value: 77 },
    { time: "17", value: 61 },
    { time: "18", value: 34 },
    { time: "19", value: 35 },
    { time: "20", value: 53 },
    { time: "21", value: 32 },
    { time: "22", value: 34 },
    { time: "23", value: 22 },
    { time: "24", value: 30 },
    { time: "25", value: 53 },
    { time: "26", value: 32 },
    { time: "27", value: 34 },
    { time: "28", value: 22 },
    { time: "29", value: 30 },
    { time: "30", value: 30 },
    { time: "31", value: 30 },
  ];

  const weeklyData = [
    { time: "월", value: 42 },
    { time: "화", value: 23 },
    { time: "수", value: 13 },
    { time: "목", value: 13 },
    { time: "금", value: 33 },
    { time: "토", value: 13 },
    { time: "일", value: 32 },
  ];

  const dayData = [
    { time: "1", value: 42 },
    { time: "2", value: 23 },
    { time: "3", value: 13 },
    { time: "4", value: 13 },
    { time: "5", value: 33 },
    { time: "6", value: 13 },
    { time: "7", value: 32 },
    { time: "8", value: 94 },
    { time: "9", value: 67 },
    { time: "10", value: 30 },
    { time: "11", value: 30 },
    { time: "12", value: 110 },
    { time: "13", value: 62 },
    { time: "14", value: 35 },
    { time: "15", value: 30 },
    { time: "16", value: 77 },
    { time: "17", value: 61 },
    { time: "18", value: 34 },
    { time: "19", value: 35 },
    { time: "20", value: 53 },
    { time: "21", value: 32 },
    { time: "22", value: 34 },
    { time: "23", value: 22 },
    { time: "24", value: 30 },
  ];

  const [data, setData] = useState(montlyData);

  const categories = data.map((item) => item.time);
  const seriesData = data.map((item) => item.value);

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

  useEffect(() => {
    switch (filter) {
      case "일자":
        setData(montlyData);
        break;
      case "요일":
        setData(weeklyData);
        break;
      case "시간":
        setData(dayData);
        break;
    }
  }, [filter]);

  return (
    <div className="grow border-4 border-[#F5F5F5] rounded-2xl">
      {/* 그래프의 전체 가로 너비 설정 */}
      <Chart options={chartOptions} series={series} type="bar" height="100%" />
    </div>
  );
};

export default HistogramChart;
