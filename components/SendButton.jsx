import React from "react";

function SendButton({ onClick, disabled }) {
  return (
    <button onClick={onClick} className="send-btn" disabled={disabled}>
      Send Message
    </button>
  );
}

export default SendButton; 