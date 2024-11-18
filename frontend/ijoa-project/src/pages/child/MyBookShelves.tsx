import React, { useEffect, useState } from "react";
import bookshelfEmpty from "/assets/child/bookshelf_none.jpg";
import bookshelfRead from "/assets/child/bookshelf_read.jpg";
import girl from "/assets/child/empty_book.png";
import MyBookSwiper from "../../components/child/MyBookSwiper";
import CurtainAnimation from "../../components/child/CurtainAnimation";
import { fairyTaleApi } from "../../api/fairytaleApi";
import { FairyTaleReadCheckItem } from "../../types/fairytaleTypes";
import BookCoverGrid from "../../components/child/BookCoverGrid";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MyBookShelves: React.FC = () => {
  const [isCurtainOpen, setIsCurtainOpen] = useState(false);
  const [myBookLists, setMyBookLists] = useState<FairyTaleReadCheckItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const myBookReadOrNot = myBookLists.map((fairyTale) => fairyTale.isCompleted);
  const navigate = useNavigate();

  // 읽거나 읽는 중인 책 목록을 API에서 가져오는 함수
  const getMyBookLists = async () => {
    try {
      const response = await fairyTaleApi.getFairytalesReadList(1, 20);
      if (response.status === 200 && response.data && Array.isArray(response.data.content)) {
        setMyBookLists(response.data.content);
      }
    } catch (error) {
      console.error("fairytaleApi의 getFairytalesReadList:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsCurtainOpen(true), 2000);
    }
  };

  useEffect(() => {
    getMyBookLists();
  }, []);

  // myBookLists 배열을 반으로 나누기
  const halfwayIndex = Math.ceil(myBookLists.length / 2);
  const firstHalf = myBookLists.slice(0, halfwayIndex);
  const secondHalf = myBookLists.slice(halfwayIndex);

  const toContentPage = (id: number) => {
    navigate(`/fairytale/content/${id}`);
  };

  // 읽은 책이 있을 때와 없을 때의 배경 이미지 설정
  const backgroundImage = isLoading ? null : myBookLists.length === 0 ? bookshelfEmpty : bookshelfRead;

  return (
    <div className="w-full h-screen relative font-['MapleLight'] overflow-hidden">
      {backgroundImage && (
        <img src={backgroundImage} alt="배경" className="fixed top-0 left-0 w-full h-full object-cover opacity-70" />
      )}
      <div className="absolute z-20">
        <CurtainAnimation />
      </div>
      {isCurtainOpen && (
        <>
          <p
            className={`w-full absolute top-[90px] font-bold mb-10 text-3xl ${
              myBookLists.length > 0 ? "text-black" : "hidden"
            } text-center`}
          >
            📚 내가 읽은 책들이야!
          </p>
          <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
            {myBookLists.length === 0 ? (
              <div>
                <motion.img
                  src={girl}
                  alt="책 찾는 아기"
                  className="absolute w-1/5 left-20 top-40"
                  animate={{
                    x: ["0%", "-10%", "0%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {/* 말풍선 스타일을 적용한 텍스트 */}
                <div className="relative inline-block left-40 bg-[#ffffff] text-black text-2xl font-bold p-4 rounded-lg whitespace-pre-line mt-4 mx-auto shadow-lg w-max opacity-70">
                  <p>{"아직 읽은 동화책이 없어요!\n동화책을 읽으러 가볼까요?"}</p>
                  <div className="absolute -bottom-2 left-12 w-0 h-0 border-t-8 border-t-[#ffffff] border-l-8 border-l-transparent border-r-8 border-r-transparent opacity-70"></div>
                </div>
              </div>
            ) : myBookLists.length >= 13 ? (
              <>
                <div className="mb-16 mt-24">
                  <MyBookSwiper
                    direction=""
                    myBookLists={firstHalf}
                    myBookReadOrNot={firstHalf.map((book) => book.isCompleted)}
                    progress={firstHalf.map((book) => book.progressRate || 0)}
                  />
                </div>
                <div>
                  <MyBookSwiper
                    direction="reverse"
                    myBookLists={secondHalf}
                    myBookReadOrNot={secondHalf.map((book) => book.isCompleted)}
                    progress={secondHalf.map((book) => book.progressRate || 0)}
                  />
                </div>
              </>
            ) : (
              <div className="text-black mt-32 font-bold">
                <BookCoverGrid
                  bookCovers={myBookLists.map((book) => book.image || "")}
                  titles={myBookLists.map((book) => book.title || "")}
                  onBookClick={(index) => toContentPage(myBookLists[index].fairytaleId)}
                  myBookReadOrNot={myBookReadOrNot}
                  progress={myBookLists.map((book) => book.progressRate || 0)}
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
