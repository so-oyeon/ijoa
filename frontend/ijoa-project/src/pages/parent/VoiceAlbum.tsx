import { useEffect, useState } from "react";
import DateList from "../../components/parent/voiceAlbum/DateList";
import VoiceAlbumBookcase from "../../components/parent/voiceAlbum/VoiceAlbumBookcase";
import ChildDropDown from "../../components/parent/ChildDropDown";
import { ChildInfo } from "../../types/parentTypes";
import { parentApi } from "../../api/parentApi";
import LoadingAnimation from "../../components/common/LoadingAnimation";

const VoiceAlbum = () => {
  const today = new Date();
  const initialStartDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const initialEndDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    lastDayOfMonth
  ).padStart(2, "0")}`;

  const [selectStartDate, setSelectStartDate] = useState<string>(initialStartDate);
  const [selectEndDate, setSelectEndDate] = useState<string>(initialEndDate);
  const [childList, setChildList] = useState<ChildInfo[] | null>(null);
  const [selectChild, setSelectChild] = useState<ChildInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 자녀 프로필 목록 조회 API 통신 함수
  const getChildInfoList = async () => {
    try {
      setIsLoading(true);
      const response = await parentApi.getChildProfileList();
      if (response.status === 200) {
        setChildList(response.data);
        setSelectChild(response.data[0]);
      }
    } catch (error) {
      console.log("parentApi의 getChildProfileList : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getChildInfoList();
  }, []);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (!selectChild || !childList || childList?.length === 0) {
    return (
      <div className="h-screen px-20 pt-28 pb-10 flex justify-center items-center">
        <p>먼저 자녀 프로필을 만들어 주세요!</p>
      </div>
    );
  }

  return (
    <div className="px-20 pt-24 pb-10 h-screen grid grid-cols-4 gap-20 relative font-['IMBold']">
      {/* 좌측상단 아이콘 */}
      <img className="w-24 absolute left-1/4 top-10 z-10" src="/assets/parent/voiceAlbum/bookcase-icon.png" alt="" />

      <div className="grid gap-3">
        <div className="flex flex-col justify-center items-center space-y-3 mt-2">
          <img
            className="w-1/3 aspect-1 bg-white rounded-full border object-cover"
            src={selectChild.profileUrl}
            alt=""
          />

          <p className="text-lg font-bold">
            {selectChild.name} / 만 {selectChild.age}세
          </p>

          <ChildDropDown childList={childList} setSelectChild={setSelectChild} />
        </div>

        {/* 날짜 메뉴 드롭다운 */}
        <div className="h-full pt-16 relative">
          <div className="w-8 aspect-1 bg-[#FC9B35] rounded-full shadow-[1px_3px_3px_2px_rgba(0,0,0,0.2)] absolute top-5 left-1/2"></div>
          <DateList setSelectStartDate={setSelectStartDate} setSelectEndDate={setSelectEndDate} />
        </div>
      </div>

      <div className="col-span-3">
        <VoiceAlbumBookcase
          selectStartDate={selectStartDate}
          selectEndDate={selectEndDate}
          childId={selectChild.childId}
        />
      </div>

      {/* 우측하단 아이콘 */}
      <img className="w-24 absolute right-10 bottom-5" src="/assets/parent/voiceAlbum/child-learning-icon.png" alt="" />
    </div>
  );
};

export default VoiceAlbum;
