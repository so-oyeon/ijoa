import React from "react";
import "../../css/CurtainAnimation.css";

const CurtainAnimation: React.FC = () => {
  return (

    <div id="scene" className="expand">
      <div id="curtain" className="open">
        <div className="left"></div>
        <div className="right"></div>
      </div>
      <div className="ground"></div>
    </div>
  );
};

export default CurtainAnimation;
