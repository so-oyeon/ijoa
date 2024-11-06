import React, { useEffect, useState } from "react";
import hall from "/assets/child/hall.png";
import MyBookSwiper from "../../components/child/MyBookSwiper";
import CurtainAnimation from "../../components/fairytales/CurtainAnimation";
import { fairyTaleApi } from "../../api/fairytaleApi";
import { FairyTaleReadCheckItem } from "../../types/fairytaleTypes";
import BookCoverGrid from "../../components/fairytales/BookCoverGrid";

const MyBookShelves: React.FC = () => {
  const [isCurtainOpen, setIsCurtainOpen] = useState(false);
  const [myBookLists, setMyBookLists] = useState<FairyTaleReadCheckItem[]>([]);

  const myBookReadOrNot = myBookLists.map((fairyTale) => fairyTale.isCompleted);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCurtainOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 읽거나 읽는 중인 책 목록을 API에서 가져오는 함수
  const getMyBookLists = async () => {
    try {
      const response = await fairyTaleApi.getFairytalesReadList(0);
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        if (data && Array.isArray(data.content)) {
          setMyBookLists(data.content);
        }
      }
    } catch (error) {
      console.error("fairytaleApi의 getFairytalesReadList:", error);
    }
  };

  // 컴포넌트가 마운트될 때 책 목록 가져오기
  useEffect(() => {
    getMyBookLists();
  }, []);

  return (
    <div className="w-full h-screen relative fairytale-font">
      {/* 배경 이미지 */}
      <img src={hall} alt="배경" className="w-screen h-screen object-cover" />

      <div className="absolute z-20">
        <CurtainAnimation />
      </div>

      {isCurtainOpen && (
        <>
          {/* 스와이퍼 */}
          <p className="w-full absolute top-[100px] mb-10 text-3xl text-white text-center">📚 내가 읽은 책이야!</p>
          <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            {/* 슬라이드 개수가 5개 이상이면 스와이퍼로, 아니라면 BookCoverGrid 컴포넌트로 조건부 렌더링 */}
            {myBookLists.length >= 5 ? (
              <>
                <div className="mb-5">
                  <MyBookSwiper direction={""} myBookLists={myBookLists} myBookReadOrNot={myBookReadOrNot} />
                </div>
                <div>
                  <MyBookSwiper direction={"reverse"} myBookLists={myBookLists} myBookReadOrNot={myBookReadOrNot} />
                </div>
              </>
            ) : (
              <div className="ml-10 text-white">
                <BookCoverGrid
                  bookCovers={myBookLists.map((book) => book.image || "")}
                  titles={myBookLists.map((book) => book.title || "")}
                  onBookClick={(index) => console.log(`Clicked book index: ${index}`)}
                  myBookReadOrNot={myBookReadOrNot}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyBookShelves;
