import React, { useEffect, useState } from "react";
import "../../css/CurtainAnimation.css";

const CurtainAnimation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="scene" className={isOpen ? "expand" : ""}>
      <div id="curtain" className={isOpen ? "open" : ""}>
        <div className="left"></div>
        <div className="right"></div>
      </div>
      <div className="ground"></div>
    </div>
  );
};

export default CurtainAnimation;
