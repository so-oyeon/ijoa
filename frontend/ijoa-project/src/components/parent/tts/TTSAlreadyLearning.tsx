interface Props {
  setIsAlreadyLearning: (status: boolean) => void;
}

const TTSAlreadyLearning = ({ setIsAlreadyLearning }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 font-['MapleLight']">
      <div className="w-full max-w-xs md:max-w-md lg:max-w-lg text-center bg-white rounded-2xl shadow-lg mx-4">
        <div className="px-4 py-8">
          <div className="text-xl md:text-2xl font-bold">더빙 보이스 생성 중 입니다.</div>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-6">
            <button
              onClick={() => setIsAlreadyLearning(false)}
              className="w-full md:w-28 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-2xl border-2 border-[#67CCFF] active:bg-[#005f99]">
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTSAlreadyLearning;
