import { ResponsiveBar } from "@nivo/bar";

const Histogram = () => {
  const data = [
    {
      time: "1시",
      value: 0,
    },
    {
      time: "2시",
      value: 0,
    },
    {
      time: "3시",
      value: 0,
    },
    {
      time: "4시",
      value: 0,
    },
    {
      time: "5시",
      value: 0,
    },
    {
      time: "6시",
      value: 0,
    },
    {
      time: "7시",
      value: 32,
    },
    {
      time: "8시",
      value: 232,
    },
    {
      time: "9시",
      value: 67,
    },
    {
      time: "10시",
      value: 30,
    },
    {
      time: "11시",
      value: 30,
    },
    {
      time: "12시",
      value: 112,
    },
    {
      time: "13시",
      value: 0,
    },
    {
      time: "14시",
      value: 15,
    },
    {
      time: "15시",
      value: 30,
    },
    {
      time: "16시",
      value: 77,
    },
    {
      time: "17시",
      value: 509,
    },
    {
      time: "18시",
      value: 14,
    },
    {
      time: "19시",
      value: 35,
    },
    {
      time: "20시",
      value: 128,
    },
    {
      time: "21시",
      value: 12,
    },
    {
      time: "22시",
      value: 0,
    },
    {
      time: "23시",
      value: 0,
    },
    {
      time: "24시",
      value: 0,
    },
  ];
  return (
    <div className="w-3/5 h-1/2 p-3 border-4 border-[#F5F5F5] rounded-2xl">
      <ResponsiveBar
        data={data}
        keys={["value"]}
        indexBy="time"
        margin={{ bottom: 30 }}
        groupMode="grouped"
        layout="vertical"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "pastel2" }}
        borderRadius={5}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          // legend: "time",
          // legendPosition: "middle",
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={null}
        enableGridY={false}
        labelSkipWidth={0}
        labelSkipHeight={5}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        legends={[]}
        theme={{
          axis: {
            ticks: {
              text: {
                fontSize: 14, // x축 키 값 텍스트 크기 설정
              },
            },
          },
        }}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
      />
    </div>
  );
};

export default Histogram;
