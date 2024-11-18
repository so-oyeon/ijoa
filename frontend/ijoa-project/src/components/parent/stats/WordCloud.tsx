import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";
import { parentApi } from "../../../api/parentApi";
import { TypographyData } from "../../../types/parentTypes";
import { useEffect, useState } from "react";

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
      const response = await parentApi.getTypography(Number(childId), 5);
      if (response.status === 200) {
        setData(response.data);
      } else if (response.status === 204) {
        setData([]);
      }
    } catch (error) {
      console.log("", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTypographyData();
  }, [childId]);

  if (!data || isLoading) {
    return (
      <div className="grow border-4 border-[#F5F5F5] rounded-2xl flex flex-col justify-center items-center">
        <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
        <p>데이터를 조회하고 있어요.</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="grow border-4 border-[#F5F5F5] rounded-2xl flex flex-col justify-center items-center">
        <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
        <p>조회된 데이터가 없습니다. 책을 먼저 읽어주세요!</p>
      </div>
    );
  }

  return (
    <div className="pt-5 flex flex-col relative">
      <div className="grow p-3 border-4 border-[#F5F5F5] rounded-2xl">
        <p className="w-2/3 py-2 text-center font-semibold bg-[#B1EBAB] rounded-full absolute top-0 left-1/2 transform -translate-x-1/2">
          이런 책이 재밌어요
        </p>

        <div className="w-full h-full flex flex-col justify-center items-center">
          {data.map((item, index) => (
            <p key={index}>{item.word}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordCloud;
