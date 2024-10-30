import DateList from "../../components/parent/voiceAlbum/DateList";

const VoiceAlbum = () => {
  return (
    <div className="px-20 pt-24 pb-10 min-h-screen">
      <div className="w-1/4 py-14 relative">
        <div className="w-8 aspect-1 bg-[#FC9B35] rounded-full shadow-[1px_3px_3px_2px_rgba(0,0,0,0.2)] absolute top-5 left-1/2"></div>
        <DateList />
      </div>
    </div>
  );
};

export default VoiceAlbum;
