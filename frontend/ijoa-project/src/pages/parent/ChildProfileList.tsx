import { useEffect, useState } from "react";
import { TbPencilMinus } from "react-icons/tb";
import { IoIosAdd } from "react-icons/io";
import ChildProfileCreateModal from "../../components/parent/childProfile/ChildProfileCreateModal";
import ChildProfileUpdateModal from "../../components/parent/childProfile/ChildProfileUpdateModal";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";
import { parentApi } from "../../api/parentApi";
import { ChildInfo } from "../../types/parentTypes";
import LoadingAnimation from "../../components/common/LoadingAnimation";

const ChildProfileList = () => {
  const navigate = useNavigate();
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [childList, setChildList] = useState<ChildInfo[] | null>(null);
  const [updateChildInfo, setUpdateChildInfo] = useState<ChildInfo | null>(null);

  // 자녀 계정으로 전환
  const handleGoToChildAccount = async (childId: number) => {
    try {
      const response = await userApi.switchChild(childId);
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("childId", response.data.userId);
        localStorage.setItem("userType", "child");
        localStorage.setItem("bgm", "true");
        localStorage.setItem("quizEnabled", "true");
        localStorage.setItem("readAloudEnabled", "true");
        navigate("/child/fairytale/list");
      }
    } catch (error) {
      console.log("userApi의 switchChild : ", error);
    }
  };

  // 자녀 프로필 수정 모달 열기
  const handleUpdateChild = (childInfo: ChildInfo) => {
    setUpdateChildInfo(childInfo);
  };

  // 자녀 프로필 목록 조회 API 통신 함수
  const getChildInfoList = async () => {
    try {
      const response = await parentApi.getChildProfileList();
      if (response.status === 200) {
        setChildList(response.data);
      }
    } catch (error) {
      console.log("parentApi의 getChildProfileList : ", error);
    }
  };

  // 수정할 자식 프로필 데이터가 state에 저장되면 모달 열기
  useEffect(() => {
    setIsUpdateModal(true);
  }, [updateChildInfo]);

  // 렌더링 시, 자식 프로필 목록 조회 통신 함수 호출
  useEffect(() => {
    getChildInfoList();
  }, []);

  // childList가 null이면 loading 화면 출력
  if (!childList) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen pt-24 bg-[#EAF8FF] relative font-['IMBold']">
      <div className="px-40 py-10 grid gap-10">
        {/* 상단 타이틀 */}
        <div className="flex justify-center items-center space-x-3">
          <img className="w-10 aspect-1" src="/assets/header/parent/child-icon.png" alt="" />
          <p className="text-[30px] font-semibold">자녀를 선택해주세요</p>
        </div>

        <div className="grid grid-cols-3 gap-y-12">
          {/* 자녀 목록 */}
          {childList.map((child, index) => (
            <div className="flex flex-col items-center space-y-3" key={index}>
              <div className="w-52 aspect-1 relative">
                <img
                  className="w-full aspect-1 bg-white rounded-full border object-cover"
                  src={child.profileUrl}
                  alt=""
                  onClick={() => handleGoToChildAccount(child.childId)}
                />
                <div
                  className="w-12 aspect-1 bg-white rounded-full bg-opacity-50 shadow-[1px_3px_2px_0_rgba(0,0,0,0.2)] flex justify-center items-center absolute top-0 right-0"
                  onClick={() => handleUpdateChild(child)}>
                  <TbPencilMinus className="text-2xl" />
                </div>
              </div>

              <p className="text-2xl font-bold">
                {child.name} / 만 {child.age}세
              </p>
            </div>
          ))}

          {/* 자녀 추가 버튼 */}
          {childList.length < 9 ? (
            <button className="flex justify-center items-center" onClick={() => setIsCreateModal(true)}>
              <IoIosAdd className="text-[150px] text-white bg-[#D9D9D9] rounded-full" />
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>

      {isCreateModal && (
        <ChildProfileCreateModal setIsCreateModal={setIsCreateModal} getChildInfoList={getChildInfoList} />
      )}
      {isUpdateModal && updateChildInfo && (
        <ChildProfileUpdateModal
          updateChildInfo={updateChildInfo}
          setIsUpdateModal={setIsUpdateModal}
          getChildInfoList={getChildInfoList}
        />
      )}
    </div>
  );
};

export default ChildProfileList;
