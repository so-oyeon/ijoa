import React, { useEffect, useState, ReactNode } from "react";
import "../../css/CurtainAnimation.css";

interface CurtainAnimationProps {
  children: ReactNode;
}

const CurtainAnimation: React.FC<CurtainAnimationProps> = ({ children }) => {
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
      {children}
    </div>
  );
};

export default CurtainAnimation;
