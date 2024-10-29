import { CiCamera } from "react-icons/ci";

interface Props {
  setIsCreateModal: (state: boolean) => void;
}

const ChildProfileCreateModal = ({ setIsCreateModal }: Props) => {
  const divStyle = "w-full grid grid-cols-[1fr_3fr] gap-x-5";
  const labelStyle = "w-20 text-lg font-semibold flex justify-center items-center";
  const inputStyle = "w-full p-3 border-2 border-[#C7C7C7] rounded-[30px] outline-none";

  return (
    <div className="py-8 bg-black bg-opacity-60 flex justify-center items-center fixed inset-0 z-50">
      <div className="px-16 py-10 bg-white rounded-3xl shadow-lg flex flex-col items-center space-y-8">
        {/* 타이틀 텍스트 */}
        <div className="text-xl font-bold">
          <span className="underline underline-offset-[-3px] decoration-8 decoration-[#67CCFF]">자녀 정보</span>
          <span>를 등록해주세요</span>
        </div>

        {/* 프로필 사진 선택 */}
        <div className="w-20 h-20 border-4 border-[#9E9E9E] rounded-full flex justify-center items-center">
          <CiCamera className="text-[50px]" />
        </div>

        {/* 입력필드 */}
        <div className="grid gap-5">
          {/* 이름 입력 */}
          <div className={`${divStyle}`}>
            <label className={`${labelStyle}`} htmlFor="name">
              이름
            </label>
            <input className={`${inputStyle}`} type="text" id="name" />
          </div>

          {/* 생년월일 입력 */}
          <div className={`${divStyle}`}>
            <label className={`${labelStyle}`} htmlFor="birth">
              생년월일
            </label>
            <input className={`${inputStyle}`} type="text" id="birth" />
          </div>

          {/* 성별 입력 */}
          <div className="flex justify-start items-center space-x-5">
            <p className={`${labelStyle}`}>성별</p>

            <div className="flex space-x-5">
              <div className="flex space-x-2">
                <input className="w-8 border-[#C7C7C7]" type="radio" name="gender" id="male" />
                <label htmlFor="male">남자</label>
              </div>
              <div className="flex space-x-2">
                <input className="w-8 border-[#C7C7C7]" type="radio" name="gender" id="female" />
                <label htmlFor="female">여자</label>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 justify-center items-center">
          <button
            className="px-8 py-2 text-[#67CCFF] text-lg font-bold bg-white rounded-3xl border-2 border-[#67CCFF]"
            onClick={() => setIsCreateModal(false)}>
            취소
          </button>
          <button className="px-8 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF]">
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChildProfileCreateModal;
