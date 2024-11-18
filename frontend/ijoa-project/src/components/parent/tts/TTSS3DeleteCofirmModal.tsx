import { AxiosError } from "axios";
import { parentApi } from "../../../api/parentApi";

interface Props {
  ttsId: number;
  setIsDeleteS3Modal: (status: boolean) => void;
  setIsCreateGuideModal: (status: boolean) => void;
  getParentTTSList: () => void;
}

const TTSS3DeleteCofirmModal = ({ ttsId, setIsDeleteS3Modal, setIsCreateGuideModal, getParentTTSList }: Props) => {
  // 학습 시작 요청
  const handleTrainTTS = async () => {
    try {
      const response = await parentApi.getTrainTTS(ttsId);
      if (response.status === 200) {
        setIsDeleteS3Modal(false);
        getParentTTSList();
      }
    } catch (error) {
      console.log("parentApi의 getTrainTTS : ", error);
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status) {
        return axiosError.response.status;
      }
    }
  };

  const handleCreateTTS = () => {
    setIsDeleteS3Modal(false);
    setIsCreateGuideModal(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 font-['MapleLight']">
      <div className="w-full max-w-xs md:max-w-md lg:max-w-lg text-center bg-white rounded-2xl shadow-lg mx-4 relative">
        <div className="px-4 py-10">
          <button onClick={() => setIsDeleteS3Modal(false)} className="absolute top-4 right-4">
            <img src="/assets/close-button.png" alt="Close" />
          </button>
          <div className="text-xl md:text-2xl font-bold">
            기존에 녹음돼있던 음성파일이 있습니다.
            <br />
            기존의 음성파일로 생성할까요?
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-6">
            <button
              onClick={() => handleTrainTTS()}
              className="w-full md:w-28 py-2 text-white text-lg font-bold bg-[#FF8067] rounded-2xl border-2 border-[#FF8067] active:bg-red-500">
              유지
            </button>
            <button
              onClick={handleCreateTTS}
              className="w-full md:w-28 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-2xl border-2 border-[#67CCFF] active:bg-[#005f99]">
              재녹음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTSS3DeleteCofirmModal;
