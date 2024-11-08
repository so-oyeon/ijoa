import React from "react";
import bookclip from "/assets/fairytales/images/bookclip.png";
import "../../css/FairytaleContentPage.css";

interface BookCoverGridProps {
  bookCovers: string[];
  titles: string[];
  onBookClick: (index: number) => void;
  myBookReadOrNot?: boolean[];
  progress?: number[]; // 진행률
}

const BookCoverGrid: React.FC<BookCoverGridProps> = ({
  bookCovers,
  titles,
  onBookClick,
  myBookReadOrNot,
  progress,
}) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="grid grid-cols-4 gap-5 justify-center">
        {bookCovers.map((cover, index) => (
          <div key={index} onClick={() => onBookClick(index)} className="relative cursor-pointer w-[350px]">
            <img src={cover} alt="동화책 표지 사진" className="relative w-full h-[200px] object-cover rounded-lg" />
            
            {/* 진행 상태바 */}
            {progress && progress[index] > 0 && progress[index] < 100 && (
              <div className="absolute bottom-[48px] left-0 w-full h-2 bg-gray-300 rounded">
                <div
                  className="h-full bg-red-400 rounded"
                  style={{ width: `${progress[index]}%` }} // API에서 받아온 진행률 사용
                ></div>
              </div>
            )}

            {/* 읽음 여부에 따라 우측 상단에 bookclip 이미지 표시 */}
            {myBookReadOrNot && myBookReadOrNot[index] && (
              <img src={bookclip} alt="읽음 표시" className="absolute -top-7 -right-3 w-20 h-20 z-10" />
            )}

            <div className="mt-5">
              <span className="text-xl font-semibold font-['MapleLight']">{titles[index]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCoverGrid;
