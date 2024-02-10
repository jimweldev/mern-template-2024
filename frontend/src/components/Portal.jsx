import React from "react";
import ReactDOM from "react-dom";

const Portal = ({ children }) => {
  return ReactDOM.createPortal(
    <div>{children}</div>,
    document.getElementById("portal")
  );
};

export default Portal;
