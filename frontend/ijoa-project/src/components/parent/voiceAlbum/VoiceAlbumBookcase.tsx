import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import "../../../css/VoiceAlbum.css";
import BoiceAlbumList from "./VoiceAlbumList";
import { useEffect, useState } from "react";
import { VoiceAlbumBookInfo } from "../../../types/voiceAlbumTypes";
import { parentApi } from "../../../api/parentApi";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";

interface Props {
  selectStartDate: string;
  selectEndDate: string;
  childId: number;
}

const VoiceAlbumList = ({ selectStartDate, selectEndDate, childId }: Props) => {
  const [bookList, setBookList] = useState<VoiceAlbumBookInfo[] | null>(null);
  const [totalPage, setTotalPage] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 다음 페이지 보기
  const handleNext = () => {
    if (totalPage === currentPage) return;

    setCurrentPage((prev) => prev + 1);
  };

  // 이전 페이지 보기
  const handlePrev = () => {
    if (1 === currentPage) return;

    setCurrentPage((prev) => prev - 1);
  };

  const getVoiceAlbumBookList = async () => {
    const data = {
      startDate: selectStartDate,
      endDate: selectEndDate,
    };

    try {
      const response = await parentApi.getVoiceAlbumBookList(childId, currentPage, data);
      if (response.status === 200) {
        setTotalPage(response.data.totalPages);
        setBookList(response.data.content);
      }
    } catch (error) {
      console.log("parentApi의 getVoiceAlbumBookList : ", error);
    }
  };

  useEffect(() => {
    getVoiceAlbumBookList();
  }, [childId, selectStartDate, currentPage]);

  if (!bookList || bookList?.length === 0)
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
        <p className="font-semibold">앨범이 존재하지 않습니다</p>
      </div>
    );

  return (
    <div className="voice-album-font w-full h-full p-1 relative">
      <div className="w-full h-full bg-[#FFD979] rounded-2xl flex justify-center items-end">
        {/* 상단 리스트 및 책장 */}
        <BoiceAlbumList partBookList={bookList.slice(0, 4)} topSize={25} childId={childId} />

        {/* 하단 리스트 및 책장 */}
        <BoiceAlbumList partBookList={bookList.slice(4, 8)} topSize={70} childId={childId} />

        {/* 화살표 및 쪽수 */}
        {bookList.length === 0 ? (
          <></>
        ) : (
          <div className="py-3 flex justify-between items-center space-x-3">
            <BiSolidLeftArrow
              className={`text-2xl text-[#FF5B5B] ${currentPage === 1 ? "opacity-0" : ""}`}
              onClick={handlePrev}
            />
            <p className="w-20 text-xl text-center font-semibold text-[#5E3200]">
              {currentPage} / {totalPage}
            </p>
            <BiSolidRightArrow
              className={`text-2xl text-[#6E78FF] ${totalPage === currentPage ? "opacity-0" : ""}`}
              onClick={handleNext}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAlbumList;
