import { useEffect, useState } from "react";
import Lottie from "react-lottie-player";
import ReactWordcloud from "react-wordcloud";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";
import { parentApi } from "../../../api/parentApi";
import { TypographyData } from "../../../types/parentTypes";

interface Props {
  childId: number;
}

const WordCloud = ({ childId }: Props) => {
  const [data, setData] = useState<TypographyData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getTypographyData = async () => {
    if (!childId) return;

    try {
      setIsLoading(true);
      const response = await parentApi.getTypography(Number(childId), 10);
      if (response.status === 200) {
        setData(response.data);
      } else if (response.status === 204) {
        setData([]);
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTypographyData();
  }, [childId]);

  if (isLoading) {
    return (
      <div className="grow border-4 border-[#F5F5F5] rounded-2xl flex flex-col justify-center items-center">
        <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
        <p>데이터를 조회하고 있어요.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="grow border-4 border-[#F5F5F5] rounded-2xl flex flex-col justify-center items-center">
        <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
        <p>조회된 데이터가 없습니다. 책을 먼저 읽어주세요!</p>
      </div>
    );
  }

  // 랜덤 색상 함수 (예시)
  const getRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // ReactWordcloud 옵션 설정
  const options = {
    rotations: 0,
    rotationAngles: [-90, 0] as [number, number],
    fontSizes: [20, 60] as [number, number],
    fontFamily: 'MapleLight',
    color: 'random-light',
    enableTooltip: false, 
  };

  // 데이터를 ReactWordcloud에 맞는 형식으로 변환
  const words = data.map((item) => ({
    text: item.word, // 단어
    value: Math.floor(Math.random() * 100) + 10, // 랜덤 가중치 값 (frequency 대신 사용)
    color: getRandomColor(), // 랜덤 색상 지정
  }));

  return (
    <div className="pt-5 flex flex-col relative">
      <div className="grow p-4 border-4 border-[#F5F5F5] rounded-2xl">
        <p className="w-2/3 py-1 text-center font-semibold bg-[#B1EBAB] rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
          이런 단어를 좋아해요!
        </p>

        <div className="w-full h-[200px] flex flex-col justify-center items-center">
          <ReactWordcloud words={words} options={options} />
        </div>
      </div>
    </div>
  );
};

export default WordCloud;
