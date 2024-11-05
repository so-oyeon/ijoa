import Chart from "react-apexcharts";

const PieChart = () => {
  // 차트 데이터와 설정 옵션
  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["의사소통", "자연과학", "사회관계", "예술경험", "신체운동/건강"],
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

  // 각 데이터의 값
  const series = [590, 168, 594, 410, 583];

  return (
    <div className="grow p-3 border-4 border-[#F5F5F5] rounded-2xl flex items-center">
      <Chart options={chartOptions} series={series} type="donut" height="100%" />
    </div>
  );
};

export default PieChart;
