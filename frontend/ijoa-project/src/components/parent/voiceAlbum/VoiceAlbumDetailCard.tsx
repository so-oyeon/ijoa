import { useEffect, useState } from "react";
import { VoiceAlbumDetailCardInfo } from "../../../types/voiceAlbum";
import { BiSolidRightArrow } from "react-icons/bi";

interface Props {
  voiceInfo: VoiceAlbumDetailCardInfo;
}

const VoiceAlbumDetailCard = ({ voiceInfo }: Props) => {
  const animalImages = ["elephant", "fox", "giraffe", "hippo", "tiger", "zebra"];
  const [animalImage, setAnimalImage] = useState("");

  // 동물 이미지를 랜덤으로 설정
  useEffect(() => {
    const randomAnimal = animalImages[Math.floor(Math.random() * animalImages.length)];
    setAnimalImage(randomAnimal); // 랜덤 동물 이미지 설정
    console.log(voiceInfo.img + " " + randomAnimal);
  }, []);

  return (
    <div className="h-full p-5 bg-white rounded-2xl grid grid-rows-[2fr_1fr_1fr]">
      {/* 동화책 그림 이미지 */}
      <img className="w-full aspect-2 rounded-xl object-cover" src={`/assets/${voiceInfo.img}.png`} alt="" />

      {/* 퀴즈 질문 */}
      <div className="grid grid-cols-[1fr_4fr] gap-5 place-items-center">
        <img className="w-14" src={`/assets/fairytales/images/${animalImage}.png`} alt="" />
        <p className="text-lg text-left break-keep">{voiceInfo.question}</p>
      </div>

      {/* 퀴즈 답변 */}
      <div className="flex justify-end items-center space-x-3">
        {/* 재생 버튼 */}
        <div className="w-10 aspect-1 bg-[#FFCA75] flex justify-center items-center rounded-full">
          <BiSolidRightArrow className="text-2xl text-white" />
        </div>
        {/* 음성 그래프 */}
        <img src="/assets/parent/voiceAlbum/voice-graph.png" alt="" />
        {/* 자녀 프로필 이미지 */}
        <img className="w-14 h-14 border rounded-full" src="/assets/profile-img-girl.png" alt="" />
      </div>
    </div>
  );
};

export default VoiceAlbumDetailCard;
