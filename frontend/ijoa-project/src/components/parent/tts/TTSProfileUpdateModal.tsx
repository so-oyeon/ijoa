import { useRef, useState } from "react";
import { CiCamera } from "react-icons/ci";
import { TbPencilMinus } from "react-icons/tb";
import { parentApi } from "../../../api/parentApi";
import { ParentTTSInfo } from "../../../types/parentTypes";

interface Props {
  setIsProfileUpdateModal: (state: boolean) => void;
  updateTTSInfo: ParentTTSInfo;
  getParentTTSList: () => void;
}

const TTSProfileUpdateeModal = ({ setIsProfileUpdateModal, updateTTSInfo, getParentTTSList }: Props) => {
  const [ttsName, setTTSName] = useState(updateTTSInfo.name);
  const [ttsProfileImg, setTTSProfileImg] = useState<File | null>(null);
  const [ttsProfileImgString, setTTSProfileImgString] = useState(updateTTSInfo.image_url);
  const ttsProfileImgRef = useRef<HTMLInputElement | null>(null);

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

  // TTS 프로필 수정 통신 함수
  const handleUpdateTTS = async () => {
    if (!ttsName) return;

    const formData = new FormData();
    formData.append("name", ttsName);

    if (ttsProfileImg) {
      formData.append("image", ttsProfileImg);
    }

    try {
      const response = await parentApi.updateTTSProfile(updateTTSInfo.id, formData);
      if (response.status === 200) {
        setIsProfileUpdateModal(false);
        getParentTTSList();
      }
    } catch (error) {
      console.log("parentApi의 updateTTSProfile : ", error);
    }
  };

  // TTS 프로필 삭제 통신 함수
  const handleDeleteTTS = async () => {
    const confirmFlag = confirm("정말 TTS 프로필을 삭제할까요?");
    if (confirmFlag) {
      try {
        const response = await parentApi.deleteTTSProfile(updateTTSInfo.id);
        if (response.status === 200) {
          setIsProfileUpdateModal(false);
          getParentTTSList();
        }
      } catch (error) {
        console.log("parentApi의 deleteTTSProfile : ", error);
      }
    }
  };

  return (
    <div className="py-8 bg-black bg-opacity-60 flex justify-center items-center fixed inset-0 z-50 font-['MapleLight']">
      <div className="p-10 bg-white rounded-2xl shadow-lg">
        {/* 닫기 버튼 */}
        <div className="w-full flex justify-end">
          <img
            className="w-10 h-10"
            src="/assets/close-button.png"
            alt=""
            onClick={() => setIsProfileUpdateModal(false)}
          />
        </div>

        <div className="flex flex-col items-center space-y-8">
          {/* 타이틀 텍스트 */}
          <div className="text-xl font-bold">
            <span className="blue-highlight">TTS 정보</span>
            <span>를 입력해 주세요</span>
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
              className="px-8 py-2 text-[#FF8067] text-lg font-bold bg-white rounded-3xl border-2 border-[#FF8067]"
              onClick={handleDeleteTTS}>
              삭제
            </button>
            <button
              className="px-8 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF]"
              onClick={handleUpdateTTS}>
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTSProfileUpdateeModal;
