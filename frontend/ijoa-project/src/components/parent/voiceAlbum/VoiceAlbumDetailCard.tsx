import { useEffect, useRef, useState } from "react";
import { BiSolidRightArrow } from "react-icons/bi";
import { VoiceAlbumBookDetailInfo } from "../../../types/voiceAlbumTypes";
import { parentApi } from "../../../api/parentApi";
import { ChildInfo } from "../../../types/parentTypes";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";

interface Props {
  voiceInfo: VoiceAlbumBookDetailInfo;
  childId: number;
  voiceListLength: number;
}

const VoiceAlbumDetailCard = ({ voiceInfo, childId, voiceListLength }: Props) => {
  const animalImages = ["elephant", "fox", "giraffe", "hippo", "tiger", "zebra"];
  const [animalImage, setAnimalImage] = useState("");
  const [childInfo, setChildInfo] = useState<ChildInfo | null>(null);
  const audioPlayRef = useRef<HTMLAudioElement | null>(null); // 오디오 재생을 위한 참조 변수

  // 자녀 프로필을 가져오는 api 통신 함수
  const getChildProfile = async () => {
    try {
      const response = await parentApi.getChildProfile(childId);
      if (response.status === 200) {
        setChildInfo(response.data);
      }
    } catch (error) {
      console.error("parentApi의 getChildProfile:", error);
    }
  };

  // 녹음본 자동 재생 함수
  const handlePlayRecordingAudio = () => {
    audioPlayRef.current?.play();
  };

  // 동물 이미지를 랜덤으로 설정
  useEffect(() => {
    const randomAnimal = animalImages[Math.floor(Math.random() * animalImages.length)];
    setAnimalImage(randomAnimal); // 랜덤 동물 이미지 설정

    getChildProfile();
  }, []);

  if (!childInfo)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
      </div>
    );

  return (
    <div
      className={`${
        voiceListLength === 1 ? "w-1/3" : "w-full"
      } h-full p-5 bg-white rounded-2xl flex flex-col justify-between space-y-5`}>
      {/* 동화책 그림 이미지 */}
      <img className="w-full aspect-2 rounded-xl object-cover" src={voiceInfo.image} alt="" />

      {/* 퀴즈 질문 */}
      <div className="grow grid grid-cols-[1fr_4fr] gap-5 place-items-center">
        <img className="w-14" src={`/assets/fairytales/images/${animalImage}.png`} alt="" />
        <p className="text-lg text-left break-keep">{voiceInfo.questionText}</p>
      </div>

      {/* 퀴즈 답변 */}
      <div className="flex justify-end items-center space-x-3">
        {/* 재생 버튼 */}
        <div className="w-10 aspect-1 bg-[#FFCA75] flex justify-center items-center rounded-full">
          <BiSolidRightArrow className="text-2xl text-white" onClick={handlePlayRecordingAudio} />

          {/* 오디오 재생 컨트롤바 */}
          <audio controls src={voiceInfo.answer} className="hidden" ref={audioPlayRef}></audio>
        </div>
        {/* 음성 그래프 */}
        <img src="/assets/parent/voiceAlbum/voice-graph.png" alt="" />
        {/* 자녀 프로필 이미지 */}
        <img className="w-14 h-14 border rounded-full" src={childInfo.profileUrl} alt="" />
      </div>
    </div>
  );
};

export default VoiceAlbumDetailCard;
