import React, { useEffect } from "react";
import bookclip from "/assets/fairytales/images/bookclip.png";
import "../../css/FairytaleContentPage.css";

interface BookCoverGridProps {
  bookCovers: string[];
  titles: string[];
  onBookClick: (index: number) => void;
  myBookReadOrNot?: boolean[];
  progress?: number[];
}

const BookCoverGrid: React.FC<BookCoverGridProps> = ({
  bookCovers,
  titles,
  onBookClick,
  myBookReadOrNot = [],
  progress = [],
}) => {
  useEffect(() => {
    console.log("myBookReadOrNot:", myBookReadOrNot);
  }, [myBookReadOrNot]); // myBookReadOrNot 값이 변경될 때마다 출력

  return (
    <div className="w-full h-full flex justify-center items-center px-2">
      <div className="w-full grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-center">
        {bookCovers.map((cover, index) => (
          <div key={index} onClick={() => onBookClick(index)} className="relative cursor-pointer">
            <div className="relative w-[150px] sm:w-[160px] md:w-[180px] h-[200px] mx-auto">
              <img
                src={cover}
                alt="동화책 표지 사진"
                className="book-cover-image w-full h-full object-cover rounded-lg"
              />

              {/* 진행 상태바 */}
              {progress[index] > 0 && progress[index] < 100 && (
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-300 rounded-b">
                  <div className="h-full bg-red-400 rounded-b" style={{ width: `${progress[index]}%` }}></div>
                </div>
              )}

              {/* 읽음 표시 */}
              {myBookReadOrNot[index] && (
                <img src={bookclip} alt="읽음 표시" className="absolute -top-4 -right-2 w-16 h-16 z-10" />
              )}
            </div>

            <div className="mt-2 text-center">
              <span className="text-lg md:text-xl font-semibold font-['MapleLight']">{titles[index]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCoverGrid;
