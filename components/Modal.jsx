import React from "react";

function Modal({ show, content, onClose }) {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{content}</p>
        <button onClick={onClose}>Got It!</button>
      </div>
    </div>
  );
}

export default Modal;
