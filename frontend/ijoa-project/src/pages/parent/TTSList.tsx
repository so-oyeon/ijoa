import { useEffect, useState } from "react";
import { TbPencilMinus } from "react-icons/tb";
import { IoIosAdd } from "react-icons/io";
import TTSCreateGuideModal from "../../components/parent/tts/TTSCreateGuideModal";
import TTSCreateModal from "../../components/parent/tts/TTSCreateModal";
import { parentApi } from "../../api/parentApi";
import { ParentTTSInfo } from "../../types/parentTypes";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import TTSProfileCreateModal from "../../components/parent/tts/TTSProfileCreateModal";
import TTSCreateCompleteModal from "../../components/parent/tts/TTSCreateCompleteModal";

const TTSList = () => {
  const [isProfileCreateModal, setIsProfileCreateModal] = useState(false);
  const [isCreateGuideModal, setIsCreateGuideModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isCreateCompleted, setIsCreateCompleted] = useState(false);
  const [parentTTSList, setParentTTSList] = useState<ParentTTSInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsId, setTTSId] = useState<number | null>(null);

  const getParentTTSList = async () => {
    try {
      setIsLoading(true);
      const response = await parentApi.getParentTTSList();
      if (response.status === 200) {
        setParentTTSList(response.data);
      }
    } catch (error) {
      console.log("parentApi의 getParentTTSList : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getParentTTSList();
  }, []);

  if (!parentTTSList || isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen pt-24 bg-[#EAF8FF] relative font-['IMBold']">
      <div className="p-20 grid gap-10">
        {/* 상단 타이틀 */}
        <div className="flex justify-center items-center space-x-3">
          <img className="w-10 aspect-1" src="/assets/header/parent/tts-icon.png" alt="" />
          <p className="text-[30px] font-semibold">사용자의 목소리로 학습된 TTS 목록이에요</p>
        </div>

        <div className="flex justify-center space-x-10">
          {/* TTS 목록 */}
          {parentTTSList.map((tts, index) => (
            <div className="flex flex-col items-center space-y-3" key={index}>
              <div className="w-32 aspect-1 relative">
                <img
                  className="w-full aspect-1 bg-white rounded-full border border-[#565656] object-cover"
                  src={tts.image_url}
                  alt=""
                />
                <div className="w-10 aspect-1 bg-white rounded-full bg-opacity-50 shadow-[1px_3px_2px_0_rgba(0,0,0,0.2)] flex justify-center items-center absolute top-0 right-0">
                  <TbPencilMinus className="text-2xl" />
                </div>
              </div>

              <p className="text-2xl font-bold">{tts.name}</p>
            </div>
          ))}

          {/* TTS 추가 버튼 */}
          {parentTTSList.length < 4 ? (
            <button className="flex justify-center items-center">
              <IoIosAdd
                className="text-[100px] text-white bg-[#D9D9D9] rounded-full"
                onClick={() => setIsProfileCreateModal(true)}
              />
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* TTS 프로필 생성 모달 */}
      {isProfileCreateModal ? (
        <TTSProfileCreateModal
          setIsProfileCreateModal={setIsProfileCreateModal}
          setIsCreateCompleted={setIsCreateCompleted}
          setTTSId={setTTSId}
        />
      ) : (
        <></>
      )}

      {/* TTS 프로필 생성 완료 모달 (TTS 학습 모달로 이어짐) */}
      {isCreateCompleted ? (
        <TTSCreateCompleteModal
          setIsCreateCompleted={setIsCreateCompleted}
          setIsCreateGuideModal={setIsCreateGuideModal}
        />
      ) : (
        <></>
      )}

      {/* TTS 생성 안내 모달 */}
      {isCreateGuideModal ? (
        <TTSCreateGuideModal setIsCreateGuideModal={setIsCreateGuideModal} setIsCreateModal={setIsCreateModal} />
      ) : (
        <></>
      )}

      {/* TTS 학습 모달 */}
      {isCreateModal ? <TTSCreateModal setIsCreateModal={setIsCreateModal} ttsId={ttsId ? ttsId : 0} /> : <></>}
    </div>
  );
};

export default TTSList;
