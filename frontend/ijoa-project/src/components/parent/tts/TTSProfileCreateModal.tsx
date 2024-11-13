import { useRef, useState } from "react";
import { CiCamera } from "react-icons/ci";
import { TbPencilMinus } from "react-icons/tb";
import { parentApi } from "../../../api/parentApi";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";

interface Props {
  setIsProfileCreateModal: (state: boolean) => void;
  setIsCreateCompleted: (state: boolean) => void;
  setTTSId: (id: number) => void;
}

const TTSProfileCreateModal = ({ setIsProfileCreateModal, setIsCreateCompleted, setTTSId }: Props) => {
  const [ttsName, setTTSName] = useState<string | null>(null);
  const [ttsProfileImg, setTTSProfileImg] = useState<File | null>(null);
  const [ttsProfileImgString, setTTSProfileImgString] = useState<string | null>(null);
  const ttsProfileImgRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 카메라 아이콘 클릭 시, 이미지 업로드 창 열기
  const handleUploadClick = () => {
    if (!ttsProfileImgRef.current) return;

    ttsProfileImgRef.current.click();
  };

  // 프로필 이미지 변환
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTTSProfileImgString(reader.result as string); // Data URL로 상태 업데이트
      };
      reader.readAsDataURL(file);

      setTTSProfileImg(file);
    }
  };

  // TTS 프로필 생성 통신 함수
  const handleCreateTTS = async () => {
    if (!ttsName) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", ttsName);

    if (ttsProfileImg) {
      formData.append("image", ttsProfileImg);
    }

    try {
      const response = await parentApi.createTTSProfile(formData);
      if (response.status === 201) {
        setTTSId(response.data.id);
        setIsProfileCreateModal(false);
        setIsCreateCompleted(true);
      }
    } catch (error) {
      console.log("", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 bg-black bg-opacity-60 flex justify-center items-center fixed inset-0 z-50 font-['MapleLight']">
      <div className="px-16 py-10 bg-white rounded-2xl shadow-lg flex flex-col items-center space-y-8">
        {isLoading ? (
          <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
        ) : (
          <>
            {/* 타이틀 텍스트 */}
            <div className="text-xl font-bold">
              <span className="blue-highlight">TTS 정보</span>
              <span>를 등록해주세요</span>
            </div>

            {/* 프로필 사진 선택 */}
            <div
              className="w-20 h-20 border-4 border-[#9E9E9E] rounded-full flex justify-center items-center relative"
              onClick={handleUploadClick}>
              {ttsProfileImgString ? (
                <img className="w-full aspect-1 rounded-full object-cover" src={`${ttsProfileImgString}`} alt="" />
              ) : (
                <CiCamera className="text-[50px]" />
              )}
              <div className="w-8 aspect-1 bg-white rounded-full bg-opacity-50 shadow-[1px_3px_2px_0_rgba(0,0,0,0.2)] flex justify-center items-center absolute -top-3 -right-3">
                <TbPencilMinus className="text-xl" />
              </div>
              <input className="hidden" type="file" ref={ttsProfileImgRef} onChange={handleFileChange} />
            </div>

            {/* 이름 입력 */}
            <div className="w-full grid grid-cols-[1fr_3fr] gap-x-5">
              <label className="w-20 text-lg font-semibold flex justify-center items-center" htmlFor="name">
                이름
              </label>
              <input
                className="w-full p-3 border-2 border-[#C7C7C7] rounded-[30px] outline-none"
                type="text"
                id="name"
                value={ttsName ? ttsName : ""}
                onChange={(e) => setTTSName(e.target.value)}
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-4 justify-center items-center">
              <button
                className="px-8 py-2 text-[#67CCFF] text-lg font-bold bg-white rounded-3xl border-2 border-[#67CCFF] active:bg-[#e0f7ff]"
                onClick={() => setIsProfileCreateModal(false)}>
                취소
              </button>
              <button
                className="px-8 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF active:bg-[#005f99]"
                onClick={handleCreateTTS}>
                완료
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TTSProfileCreateModal;
