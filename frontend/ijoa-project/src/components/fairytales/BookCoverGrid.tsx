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
    <div className="w-full h-full flex justify-center items-center px-2">
      <div className="w-full grid grid-cols-4 gap-5 justify-center">
        {bookCovers.map((cover, index) => (
          <div key={index} onClick={() => onBookClick(index)} className="relative cursor-pointer">
            <img src={cover} alt="동화책 표지 사진" className="book-cover-image relative w-full h-[200px] object-cover rounded-lg" />

            {/* 진행 상태바 */}
            {progress && progress[index] > 0 && progress[index] < 100 && (
              <div className="absolute bottom-[36px] left-0 w-full h-2 bg-gray-300 rounded-b">
                <div
                  className="h-full bg-red-400 rounded"
                  style={{ width: `${progress[index]}%` }}
                ></div>
              </div>
            )}

            {/* 읽음 여부에 따라 우측 상단에 bookclip 이미지 표시 */}
            {myBookReadOrNot && myBookReadOrNot[index] && (
              <img src={bookclip} alt="읽음 표시" className="absolute -top-7 -right-3 w-20 h-20 z-10" />
            )}

            <div className="mt-2 ml-2">
              <span className="text-xl font-semibold font-['MapleLight']">{titles[index]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCoverGrid;
