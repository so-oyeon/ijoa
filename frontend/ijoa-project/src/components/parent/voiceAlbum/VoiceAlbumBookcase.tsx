import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import "../../../css/VoiceAlbum.css";
import BoiceAlbumList from "./BoiceAlbumList";

const VoiceAlbumList = () => {
  return (
    <div className="voice-album-font w-full h-full p-1 relative">
      <div className="w-full h-full bg-[#FFD979] rounded-3xl flex justify-center items-end">
        {/* 상단 리스트 및 책장 */}
        <BoiceAlbumList topSize={25} startIdx={0} />

        {/* 하단 리스트 및 책장 */}
        <BoiceAlbumList topSize={70} startIdx={4} />

        {/* 화살표 및 쪽수 */}
        <div className="py-3 flex justify-between items-center space-x-3">
          <BiSolidLeftArrow className="text-2xl text-[#FF5B5B]" />
          <p className="text-xl font-semibold text-[#5E3200]">2 / 5</p>
          <BiSolidRightArrow className="text-2xl text-[#6E78FF]" />
        </div>
      </div>
    </div>
  );
};

export default VoiceAlbumList;
