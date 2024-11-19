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
import TTSProfileUpdateeModal from "../../components/parent/tts/TTSProfileUpdateModal";
import TTSAlreadyLearning from "../../components/parent/tts/TTSAlreadyLearning";
import TTSS3DeleteCofirmModal from "../../components/parent/tts/TTSS3DeleteCofirmModal";

const TTSList = () => {
  const [isProfileCreateModal, setIsProfileCreateModal] = useState(false);
  const [isProfileUpdateModal, setIsProfileUpdateModal] = useState(false);
  const [isCreateGuideModal, setIsCreateGuideModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isDeleteS3Modal, setIsDeleteS3Modal] = useState(false);
  const [isCreateCompleted, setIsCreateCompleted] = useState(false);
  const [parentTTSList, setParentTTSList] = useState<ParentTTSInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsId, setTTSId] = useState<number | null>(null);
  const [updateTTSInfo, setUpdateTTSInfo] = useState<ParentTTSInfo | null>(null);
  const [isAlreadyLearning, setIsAlreadyLearning] = useState(false);

  // TTS 프로필 수정 모달 열기
  const handleUpdateTTS = (ttsInfo: ParentTTSInfo) => {
    setUpdateTTSInfo(ttsInfo);
  };

  // TTS 프로필 목록 조회 API 통신 함수
  const getParentTTSList = async () => {
    try {
      setIsLoading(true);
      const response = await parentApi.getParentTTSList();
      console.log(response);
      if (response.status === 200) {
        setParentTTSList(response.data);
      }
    } catch (error) {
      console.log("parentApi의 getParentTTSList : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const noS3TrainTTS = (id: number) => {
    setTTSId(id);
    setIsCreateGuideModal(true);
  };

  const yesS3TrainTTS = (id: number) => {
    setTTSId(id);
    setIsDeleteS3Modal(true);
  };

  // TTS 학습 상태 분기 처리
  const learningStatus = (tts: ParentTTSInfo) => {
    // tts 모델이 있는가?
    if (tts.tts) {
      return "생성 완료";
    } else {
      // tts 모델 학습 상태가 무엇인가?
      if (tts.status === "IN_PROGRESS") {
        return "생성 중";
      } else if (tts.status === "ERROR") {
        return "생성 중 오류";
      } else {
        return "더빙 생성하기";
      }
    }
  };

  const selectStyle = (status: string) => {
    switch (status) {
      case "생성 완료":
        return "text-white bg-[#67CCFF] border-2 border-[#67CCFF] opacity-50";
      case "생성 중":
        return "text-white bg-[#67CCFF] opacity-50";
      case "생성 중 오류":
        return "text-[#FF8067] bg-white border-2 border-[#FF8067]";
      case "더빙 생성하기":
        return "text-[#67CCFF] bg-white border-2 border-[#67CCFF]";
    }
  };

  useEffect(() => {
    getParentTTSList();
  }, []);

  // 수정할 TTS 프로필 데이터가 state에 저장되면 모달 열기
  useEffect(() => {
    if (updateTTSInfo) setIsProfileUpdateModal(true);
  }, [updateTTSInfo]);

  if (!parentTTSList || isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen pt-16 bg-[#EAF8FF] relative font-['IMBold']">
      <div className="p-20 grid gap-10">
        {/* 상단 타이틀 */}
        <div className="flex flex-col justify-center items-center space-y-3">
          <div className="flex justify-center items-center space-x-3">
            <img className="w-10" src="/assets/header/parent/tts-icon.png" alt="" />
            <p className="text-[30px] font-semibold">
              {TTSList.length === 0
                ? "사용자의 목소리로 더빙 보이스를 만들어주세요"
                : "사용자의 목소리로 학습된 더빙 보이스 목록이에요"}
            </p>
          </div>
          <p className="text-xl">더빙 보이스 프로필은 4개까지 만들 수 있어요</p>
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
                <div
                  className="w-10 aspect-1 bg-white rounded-full bg-opacity-50 shadow-[1px_3px_2px_0_rgba(0,0,0,0.2)] flex justify-center items-center absolute top-0 right-0 active:scale-110"
                  onClick={() => handleUpdateTTS(tts)}>
                  <TbPencilMinus className="text-2xl" />
                </div>
              </div>

              <p className="text-2xl font-bold">{tts.name}</p>

              <button
                className={`w-40 px-3 py-2 text-lg rounded-full ${selectStyle(learningStatus(tts))}`}
                disabled={tts.tts !== null || tts.status === "IN_PROGRESS"}
                onClick={tts.trainData ? () => yesS3TrainTTS(tts.id) : () => noS3TrainTTS(tts.id)}>
                {learningStatus(tts)}
              </button>
            </div>
          ))}

          {/* TTS 추가 버튼 */}
          {parentTTSList.length < 4 ? (
            <button className="flex justify-center items-center active:scale-110">
              <IoIosAdd
                className="text-[100px] text-white bg-[#D9D9D9] rounded-full"
                onClick={() => setIsProfileCreateModal(true)}
              />
            </button>
          ) : (
            <></>
          )}
        </div>

        <p className="text-center whitespace-pre-line text-xl">
          {
            "* 더빙 보이스 프로필을 만들고 목소리를 반드시 학습시켜주세요!\n(학습된 목소리로 아이들에게 동화책을 읽어줄 수 있어요)"
          }
        </p>
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

      {/* TTS 프로필 수정 모달 */}
      {isProfileUpdateModal && updateTTSInfo ? (
        <TTSProfileUpdateeModal
          setIsProfileUpdateModal={setIsProfileUpdateModal}
          updateTTSInfo={updateTTSInfo}
          getParentTTSList={getParentTTSList}
        />
      ) : (
        <></>
      )}

      {/* TTS 프로필 생성 완료 모달 (TTS 학습 모달로 이어짐) */}
      {isCreateCompleted ? (
        <TTSCreateCompleteModal
          setIsCreateCompleted={setIsCreateCompleted}
          setIsCreateGuideModal={setIsCreateGuideModal}
          getParentTTSList={getParentTTSList}
        />
      ) : (
        <></>
      )}

      {/* TTS S3 삭제 확인 모달 */}
      {isDeleteS3Modal && (
        <TTSS3DeleteCofirmModal
          ttsId={ttsId ? ttsId : 0}
          setIsDeleteS3Modal={setIsDeleteS3Modal}
          setIsCreateGuideModal={setIsCreateGuideModal}
          getParentTTSList={getParentTTSList}
        />
      )}

      {/* TTS 생성 안내 모달 */}
      {isCreateGuideModal ? (
        <TTSCreateGuideModal
          setIsCreateGuideModal={setIsCreateGuideModal}
          setIsCreateModal={setIsCreateModal}
          getParentTTSList={getParentTTSList}
        />
      ) : (
        <></>
      )}

      {/* TTS 학습 모달 */}
      {isCreateModal ? (
        <TTSCreateModal
          setIsCreateModal={setIsCreateModal}
          ttsId={ttsId ? ttsId : 0}
          getParentTTSList={getParentTTSList}
        />
      ) : (
        <></>
      )}

      {/* TTS 학습 중 안내 모달 */}
      {isAlreadyLearning ? <TTSAlreadyLearning setIsAlreadyLearning={setIsAlreadyLearning} /> : <></>}
    </div>
  );
};

export default TTSList;
