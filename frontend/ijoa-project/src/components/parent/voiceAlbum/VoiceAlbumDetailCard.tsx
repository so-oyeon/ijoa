import { useEffect, useState } from "react";
import { VoiceAlbumDetailCardInfo } from "../../../types/voiceAlbum";

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
      <img className="w-full aspect-2 rounded-xl object-cover" src={`/assets/${voiceInfo.img}.png`} alt="" />
      <div className="grid grid-cols-[1fr_4fr] gap-5 place-items-center">
        <img className="w-14" src={`/assets/fairytales/images/${animalImage}.png`} alt="" />
        <p className="text-lg text-left break-keep">{voiceInfo.question}</p>
      </div>
    </div>
  );
};

export default VoiceAlbumDetailCard;
