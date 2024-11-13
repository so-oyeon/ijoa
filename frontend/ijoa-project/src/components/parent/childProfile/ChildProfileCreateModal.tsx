import { useRef, useState } from "react";
import { CiCamera } from "react-icons/ci";
import { parentApi } from "../../../api/parentApi";
import { TbPencilMinus } from "react-icons/tb";

interface Props {
  setIsCreateModal: (state: boolean) => void;
  getChildInfoList: () => void;
}

const ChildProfileCreateModal = ({ setIsCreateModal, getChildInfoList }: Props) => {
  const divStyle = "w-full grid grid-cols-[1fr_3fr] gap-x-5";
  const labelStyle = "w-20 text-lg font-semibold flex justify-center items-center";
  const inputStyle = "w-full p-3 border-2 border-[#C7C7C7] rounded-[30px] outline-none";

  const [childName, setChildName] = useState<string | null>(null);
  const [childBirth, setChildBirth] = useState<string | null>(null);
  const [childGender, setChildGender] = useState("남자");
  const [childProfileImg, setChildProfileImg] = useState<File | null>(null);
  const [childProfileImgString, setChildProfileImgString] = useState<string | null>(null);
  const childProfileImgRef = useRef<HTMLInputElement | null>(null);

  // 카메라 아이콘 클릭 시, 이미지 업로드 창 열기
  const handleUploadClick = () => {
    if (!childProfileImgRef.current) return;

    childProfileImgRef.current.click();
  };

  // 프로필 이미지 변환
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChildProfileImgString(reader.result as string); // Data URL로 상태 업데이트
      };
      reader.readAsDataURL(file);

      setChildProfileImg(file);
    }
  };

  // 생년월일 유효성 검사
  const checkBirthValidation = (text: string) => {
    const pattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD 형식을 나타내는 정규식
    return pattern.test(text);
  };

  // 자녀 프로필 생성 API 함수 호출
  const handleCreateChild = async () => {
    if (!childName || !childBirth || !childGender) return;

    const formData = new FormData();
    formData.append("name", childName);
    formData.append("birth", childBirth);
    formData.append("gender", childGender);

    // 프로필 이미지를 설정할 경우
    if (childProfileImg) {
      formData.append("profileImg", childProfileImg);
    }

    try {
      const response = await parentApi.createChildProfile(formData);
      if (response.status === 201) {
        setIsCreateModal(false);
        getChildInfoList();
      }
    } catch (error) {
      console.log("parentApi의 createChildProfile : ", error);
    }
  };

  return (
    <div className="py-8 bg-black bg-opacity-60 flex justify-center items-center fixed inset-0 z-50 font-['MapleLight']">
      <div className="px-16 py-10 bg-white rounded-2xl shadow-lg flex flex-col items-center space-y-8">
        {/* 타이틀 텍스트 */}
        <div className="text-xl font-bold">
          <span className="underline underline-offset-[-3px] decoration-8 decoration-[#67CCFF]">자녀 정보</span>
          <span>를 등록해주세요</span>
        </div>

        {/* 프로필 사진 선택 */}
        <div
          className="w-20 h-20 border-4 border-[#9E9E9E] rounded-full flex justify-center items-center relative"
          onClick={handleUploadClick}>
          {childProfileImgString ? (
            <img className="w-full aspect-1 rounded-full" src={`${childProfileImgString}`} alt="" />
          ) : (
            <CiCamera className="text-[50px]" />
          )}
          <div className="w-8 aspect-1 bg-white rounded-full bg-opacity-50 shadow-[1px_3px_2px_0_rgba(0,0,0,0.2)] flex justify-center items-center absolute -top-3 -right-3">
            <TbPencilMinus className="text-xl" />
          </div>
          <input className="hidden" type="file" ref={childProfileImgRef} onChange={handleFileChange} />
        </div>

        {/* 입력필드 */}
        <div className="grid gap-3">
          {/* 이름 입력 */}
          <div className={`${divStyle}`}>
            <label className={`${labelStyle}`} htmlFor="name">
              이름
            </label>
            <input
              className={`${inputStyle}`}
              type="text"
              id="name"
              placeholder="1~10자"
              maxLength={10}
              value={childName ? childName : ""}
              onChange={(e) => setChildName(e.target.value)}
            />
            {childName ? <></> : <p className={`col-start-2 px-3 py-1 text-sm text-[#FF8067]`}>이름을 입력해주세요</p>}
          </div>

          {/* 생년월일 입력 */}
          <div className={`${divStyle}`}>
            <label className={`${labelStyle}`} htmlFor="birth">
              생년월일
            </label>
            <input
              className={`${inputStyle}`}
              type="text"
              id="birth"
              placeholder="ex) 2024-01-01"
              value={childBirth ? childBirth : ""}
              onChange={(e) => setChildBirth(e.target.value)}
            />

            {childBirth && checkBirthValidation(childBirth) ? (
              <></>
            ) : (
              <p
                className={`col-start-2 px-3 py-1 text-sm text-[#FF8067]
              }`}>
                생년월일 형식을 지켜주세요
              </p>
            )}
          </div>

          {/* 성별 입력 */}
          <div className="flex justify-start items-center space-x-5">
            <p className={`${labelStyle}`}>성별</p>

            <div className="flex space-x-5">
              <div className="flex space-x-2">
                <input
                  className="w-8 border-[#C7C7C7]"
                  type="radio"
                  name="gender"
                  id="male"
                  value="MALE"
                  checked={childGender === "MALE"}
                  onChange={(e) => setChildGender(e.target.value)}
                />
                <label htmlFor="male">남자</label>
              </div>
              <div className="flex space-x-2">
                <input
                  className="w-8 border-[#C7C7C7]"
                  type="radio"
                  name="gender"
                  id="female"
                  value="FEMALE"
                  checked={childGender === "FEMALE"}
                  onChange={(e) => setChildGender(e.target.value)}
                />
                <label htmlFor="female">여자</label>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 justify-center items-center">
          <button
            className="px-8 py-2 text-[#67CCFF] text-lg font-bold bg-white rounded-3xl border-2 border-[#67CCFF] active:bg-[#e0f7ff]"
            onClick={() => setIsCreateModal(false)}>
            취소
          </button>
          <button
            className={`px-8 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF] ${
              !childName || !childBirth || !childGender || !checkBirthValidation(childBirth) ? "opacity-50" : "active:bg-[#005f99]"
            }`}
            disabled={!childName || !childBirth || !childGender || !checkBirthValidation(childBirth)}
            onClick={handleCreateChild}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChildProfileCreateModal;
