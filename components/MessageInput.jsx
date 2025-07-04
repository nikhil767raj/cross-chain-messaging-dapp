import React from "react";

function MessageInput({ message, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor="message">Message:</label>
      <input
        id="message"
        type="text"
        value={message}
        onChange={onChange}
        placeholder="Enter your message"
      />
    </div>
  );
}

export default MessageInput;
