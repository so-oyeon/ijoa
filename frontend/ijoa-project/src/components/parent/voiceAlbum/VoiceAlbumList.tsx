import { PiVinylRecord } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { VoiceAlbumBookInfo } from "../../../types/voiceAlbumTypes";

interface Props {
  topSize: number;
  partBookList: VoiceAlbumBookInfo[];
  childId: number;
}

const VoiceAlbumList = ({ topSize, partBookList, childId }: Props) => {
  const navigate = useNavigate();
  const handleGoToVoiceAlbumDetail = (bookId: number, bookTitle: string) => {
    navigate(`/parent/voice/album/${bookId}`, { state: { childId, bookTitle } });
  };

  return (
    <>
      {/* 책 리스트 */}
      <div
        className="w-full px-5 grid grid-cols-4 place-items-center absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ top: `${topSize}%` }}>
        {partBookList.map((book, index) => (
          <div
            className="w-40 h-48 p-3 relative"
            key={index}
            onClick={() => handleGoToVoiceAlbumDetail(book.book_id, book.title)}>
            <div className="w-full h-full rounded-2xl shadow-[0_5px_3px_1px_rgba(0,0,0,0.2)]">
              {/* 동화책 표지 */}
              <img className="w-full h-3/5 rounded-t-2xl object-cover" src={book.image} alt="" />

              {/* 동화책 제목 */}
              <div className="w-full h-2/5 bg-white rounded-b-2xl flex justify-center items-center">
                <p className="w-full px-3 text-[#B27F44] text-center break-keep line-clamp-2">{book.title}</p>
              </div>
            </div>

            {/* 앨범 아이콘 */}
            <div className="w-10 aspect-1 bg-white rounded-full bg-opacity-50 shadow-[1px_3px_2px_0_rgba(0,0,0,0.2)] flex justify-center items-center absolute top-0 right-0">
              <PiVinylRecord className="text-4xl" />
            </div>
          </div>
        ))}
      </div>

      {/* 책장 선반 */}
      <div
        className="w-full h-12 bg-[#FFA64A] rounded-lg shadow-[0_3px_3px_2px_rgba(0,0,0,0.2)] absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ top: `${topSize + 15}%` }}></div>
    </>
  );
};

export default VoiceAlbumList;
