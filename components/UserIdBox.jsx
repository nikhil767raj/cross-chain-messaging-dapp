import React from "react";

function UserIdBox({ walletAddress }) {
  return (
    <div className="user-id-box">
      Your User ID: {" "}
      <span className="user-id-address">
        {walletAddress || "Connect wallet to see ID"}
      </span>
    </div>
  );
}

export default UserIdBox; 