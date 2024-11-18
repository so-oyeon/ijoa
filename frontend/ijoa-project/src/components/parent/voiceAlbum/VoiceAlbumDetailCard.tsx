import { useEffect, useRef, useState } from "react";
import { BiSolidRightArrow, BiSolidVolumeFull } from "react-icons/bi";
import WaveSurfer from "wavesurfer.js";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const waveContainerRef = useRef<HTMLDivElement | null>(null);

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

  const handlePlayRecordingAudio = () => {
    if (waveSurferRef.current) {
      if (isPlaying) {
        waveSurferRef.current.pause();
        setIsPlaying(false);
      } else {
        waveSurferRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    const randomAnimal = animalImages[Math.floor(Math.random() * animalImages.length)];
    setAnimalImage(randomAnimal);
    getChildProfile();

    const initializeWaveSurfer = () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
        waveSurferRef.current = null;
      }

      if (waveContainerRef.current) {
        waveSurferRef.current = WaveSurfer.create({
          container: waveContainerRef.current,
          waveColor: "#ddd",
          progressColor: "#FFCA75",
          cursorColor: "#FFCA75",
          barWidth: 2,
          height: 30,
          responsive: true,
          normalize: true,
          interact: false,
          backend: "MediaElement", // MediaElement 사용
        });

        waveSurferRef.current.load(voiceInfo.answer);
        waveSurferRef.current.on("finish", handleAudioEnded);
      }
    };

    // 비동기로 지연 로드
    const loadAudioAndInitialize = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      initializeWaveSurfer();
    };

    loadAudioAndInitialize();

    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
        waveSurferRef.current = null;
      }
    };
  }, [voiceInfo.answer]);

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
      <img className="w-full aspect-2 rounded-xl object-cover" src={voiceInfo.image} alt="" />

      <div className="grow grid grid-cols-[1fr_4fr] gap-5 place-items-center">
        <img className="w-14" src={`/assets/fairytales/images/${animalImage}.png`} alt="" />
        <p className="text-lg text-left break-keep">{voiceInfo.questionText}</p>
      </div>

      <div className="flex justify-end items-center space-x-3">
        <div className="w-10 aspect-1 bg-[#FFCA75] flex justify-center items-center rounded-full">
          {isPlaying ? (
            <BiSolidVolumeFull className="text-2xl text-white" onClick={handlePlayRecordingAudio} />
          ) : (
            <BiSolidRightArrow className="text-2xl text-white" onClick={handlePlayRecordingAudio} />
          )}
        </div>

        {/* WaveSurfer 파형 그래프 */}
        <div ref={waveContainerRef} className="w-24 h-2 pb-8"></div>

        <img className="w-14 h-14 border rounded-full" src={childInfo.profileUrl} alt="" />
      </div>
    </div>
  );
};

export default VoiceAlbumDetailCard;
