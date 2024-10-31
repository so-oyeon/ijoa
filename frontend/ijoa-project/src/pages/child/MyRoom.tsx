import React from "react";
import bglv1 from "/assets/child/bg-lv1.png"

const MyRoom: React.FC = () => {
    return (
        <div>
          <img src={bglv1} alt="배경화면" className="w-full h-screen object-cover" />
        </div>
      );
    }
export default MyRoom;
