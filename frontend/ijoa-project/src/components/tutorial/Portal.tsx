import React from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  const el = document.getElementById("portal-root");

  if (!el) {
    return null;
  }

  return ReactDOM.createPortal(children, el);
};

export default Portal;