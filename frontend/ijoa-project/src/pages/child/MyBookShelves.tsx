import React, { useEffect, useState } from "react";
import hall from "/assets/child/bookCaseImage.jpg";
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
      const response = await fairyTaleApi.getFairytalesReadList(1, 4);
      if (response.status === 200) {
        const data = response.data;
        if (data && Array.isArray(data.content)) {
          setMyBookLists(data.content); // progressRate 값을 포함한 데이터를 상태로 설정
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
    <div className="w-full h-screen relative font-['MapleLight'] overflow-hidden">
      <img src={hall} alt="배경" className="fixed top-0 left-0 w-full h-full object-cover opacity-80" />
      <div className="absolute z-20">
        <CurtainAnimation />
      </div>
      {isCurtainOpen && (
        <>
          <p className="w-full absolute top-[100px] mb-10 text-3xl text-white text-center">
            📚 내가 읽은 책들이야!
          </p>
          <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            {myBookLists.length >= 5 ? (
              <>
                <div className="mb-5 mt-32">
                  <MyBookSwiper
                    direction={""}
                    myBookLists={myBookLists}
                    myBookReadOrNot={myBookReadOrNot}
                    progress={myBookLists.map((book) => book.progressRate || 0)} // progress 추가
                  />
                </div>
                <div>
                  <MyBookSwiper
                    direction={"reverse"}
                    myBookLists={myBookLists}
                    myBookReadOrNot={myBookReadOrNot}
                    progress={myBookLists.map((book) => book.progressRate || 0)} // progress 추가
                  />
                </div>
              </>
            ) : (
              <div className="text-white">
                <BookCoverGrid
                  bookCovers={myBookLists.map((book) => book.image || "")}
                  titles={myBookLists.map((book) => book.title || "")}
                  onBookClick={(index) => console.log(`Clicked book index: ${index}`)}
                  myBookReadOrNot={myBookReadOrNot}
                  progress={myBookLists.map((book) => book.progressRate || 0)} // progressRate 사용
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
