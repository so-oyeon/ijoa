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
import { openTutorial } from "../../redux/tutorialSlice";
import Tutorial from "../../components/tutorial/Tutorial";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";

const ChildProfileList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isTutorialOpen = useSelector((state: RootState) => state.tutorial.isOpen);

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [childList, setChildList] = useState<ChildInfo[] | null>(null);
  const [updateChildInfo, setUpdateChildInfo] = useState<ChildInfo | null>(null);

  const handleGoToChildAccount = async (childId: number) => {
    try {
      const response = await userApi.switchChild(childId);
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("childId", response.data.userId);
        localStorage.setItem("userType", "child");
        navigate("/child/fairytale/list");
      }
    } catch (error) {
      console.log("userApi의 switchChild : ", error);
    }
  };

  const handleUpdateChild = (childInfo: ChildInfo) => {
    setUpdateChildInfo(childInfo);
  };

  const getChildInfoList = async () => {
    try {
      const response = await parentApi.getChildProfileList();
      if (response.status === 200) {
        setChildList(response.data);
      }
      if (response.status === 204) {
        setChildList([]);
      }
    } catch (error) {
      console.log("parentApi의 getChildProfileList : ", error);
    }
  };

  useEffect(() => {
    setIsUpdateModal(true);
  }, [updateChildInfo]);

  useEffect(() => {
    getChildInfoList();
  }, []);

  useEffect(() => {
    const getTutorialStatus = async () => {
      try {
        const response = await userApi.getTutorialInfo();
        if (response.status === 200 && !response.data.completeTutorial) {
          dispatch(openTutorial());
        }
      } catch (error) {
        console.log("getTutorialInfo API 오류: ", error);
      }
    };

    getTutorialStatus();
  }, [dispatch]);

  if (!childList) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen pt-24 bg-[#EAF8FF] relative">
      <div className="px-5 sm:px-10 lg:px-40 py-10 grid gap-10">
        {/* 상단 타이틀 */}
        <div className="flex justify-center items-center space-x-3 font-['IMBold'] header-element">
          <img className="w-10 aspect-1" src="/assets/header/parent/child-icon.png" alt="" />
          <p className="text-[20px] sm:text-[30px] font-semibold">
            {childList.length === 0 ? "자녀 프로필을 만들어주세요" : "자녀 프로필을 선택해 주세요"}
          </p>
        </div>

        <div
          className={`${
            childList.length === 0
              ? "flex justify-center"
              : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10"
          } font-['IMBold']`}
        >
          {/* 자녀 목록 */}
          {childList.map((child, index) => (
            <div className="flex flex-col items-center space-y-3" key={index}>
              <div className="w-32 sm:w-52 aspect-1 relative">
                <img
                  className="w-full aspect-1 bg-white rounded-full border object-cover active:scale-110"
                  src={child.profileUrl}
                  alt=""
                  onClick={() => handleGoToChildAccount(child.childId)}
                />
                <div
                  className="w-8 sm:w-12 aspect-1 bg-white rounded-full bg-opacity-50 shadow-[1px_3px_2px_0_rgba(0,0,0,0.2)] flex justify-center items-center absolute top-0 right-0 active:scale-110"
                  onClick={() => handleUpdateChild(child)}
                >
                  <TbPencilMinus className="text-lg sm:text-2xl" />
                </div>
              </div>

              <p className="text-base sm:text-2xl font-bold">
                {child.name} / 만 {child.age}세
              </p>
            </div>
          ))}

          {/* 자녀 추가 버튼 */}
          {childList.length < 9 && (
            <button className="flex justify-center items-center" onClick={() => setIsCreateModal(true)}>
              <IoIosAdd className="text-[100px] sm:text-[150px] text-white bg-[#D9D9D9] rounded-full active:scale-110" />
            </button>
          )}
        </div>
      </div>

      {/* 튜토리얼 오버레이 */}
      {isTutorialOpen && <Tutorial />}

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
