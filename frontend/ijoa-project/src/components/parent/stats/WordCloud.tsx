import { useEffect, useState } from "react";
import Lottie from "react-lottie-player";
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
      const response = await parentApi.getTypography(Number(childId), 7);
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

  // 색상 함수 (이전 코드 유지)
  const getRandomColor = () => {
    const colors = [
      "#FF6F61", // 따뜻한 진한 핑크
      "#FF9F00", // 진한 오렌지
      "#F9E84E", // 밝고 풍부한 노랑
      "#58D68D", // 진한 민트
      "#5DADE2", // 풍부한 파스텔 블루
      "#AF7AC5", // 진한 라벤더
      "#F1948A", // 진한 핑크 퍼플
      "#F39C12", // 진한 금색
      "#1ABC9C", // 청록색
      "#E74C3C", // 강렬한 빨간색
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getFontSize = (index: number) => {
    const fontSizeRange = [40, 30, 20, 17, 15, 13, 10]; 
    return fontSizeRange[index] || 15; 
  };

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

  return (
    <div className="pt-1 flex flex-col relative">
      <div className="grow p-5 border-4 border-[#F5F5F5] rounded-2xl">
        <p className="w-2/3 py-1 text-center font-semibold bg-[#B1EBAB] rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
          이런 단어를 좋아해요!
        </p>

        <div className="pt-8 w-full h-[180px] flex flex-col justify-center items-center">
          {/* 단어 목록을 그리기 */}
          {data.map((item, index) => {
            const fontSize = getFontSize(index); // 데이터 순서에 맞는 글자 크기
            const color = getRandomColor(); // 랜덤 색상

            return (
              <span
                key={index}
                style={{
                  fontSize: `${fontSize}px`,
                  color: color,
                }}
                className="word-item"
              >
                {item.word}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WordCloud;
