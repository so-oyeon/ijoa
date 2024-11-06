import React from "react";

interface BookCoverGridProps {
  bookCovers: string[];
  titles: string[];
  onBookClick: (index: number) => void;
}

const BookCoverGrid: React.FC<BookCoverGridProps> = ({ bookCovers, titles, onBookClick }) => {
  return (
    <div className="grid grid-cols-4 gap-5">
      {bookCovers.map((cover, index) => (
        <div
          key={index}
          onClick={() => onBookClick(index)}
          className="cursor-pointer"
        >
          <img src={cover} alt="동화책 표지 사진" className="w-full h-48 object-cover rounded-lg" />
          <div className="mt-2 ml-2">
            <span className="text-lg font-semibold">{titles[index]}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookCoverGrid;
