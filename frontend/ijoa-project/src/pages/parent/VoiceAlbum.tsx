import DateList from "../../components/parent/voiceAlbum/DateList";
import VoiceAlbumBookcase from "../../components/parent/voiceAlbum/VoiceAlbumBookcase";

const VoiceAlbum = () => {
  return (
    <div className="px-20 pt-24 pb-10 min-h-screen grid grid-cols-4 gap-20 relative font-['IMBold']">
      {/* 좌측상단 아이콘 */}
      <img className="w-24 absolute left-1/4 top-10 z-10" src="/assets/parent/voiceAlbum/bookcase-icon.png" alt="" />

      <div className="py-14 relative">
        <div className="w-8 aspect-1 bg-[#FC9B35] rounded-full shadow-[1px_3px_3px_2px_rgba(0,0,0,0.2)] absolute top-5 left-1/2"></div>
        <DateList />
      </div>

      <div className="col-span-3">
        <VoiceAlbumBookcase />
      </div>

      {/* 우측하단 아이콘 */}
      <img className="w-24 absolute right-10 bottom-5" src="/assets/parent/voiceAlbum/child-learning-icon.png" alt="" />
    </div>
  );
};

export default VoiceAlbum;
