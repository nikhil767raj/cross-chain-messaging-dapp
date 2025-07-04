import React from "react";

function StatusInfo({ status, srcTxHash, srcTxUrl, messageId, dstTxHash, dstTxUrl, receivedMsg }) {
  return (
    <>
      {status && (
        <div className="status">
          Status: <strong>{status}</strong>
        </div>
      )}
      {srcTxHash && (
        <div className="status">
          Source Tx:&nbsp;
          <a
            href={srcTxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            {srcTxHash}
          </a>
        </div>
      )}
      {messageId && (
        <div className="status">
          Message ID:&nbsp;<code>{messageId}</code>
        </div>
      )}
      {dstTxHash && (
        <div className="status">
          Destination Tx:&nbsp;
          <a
            href={dstTxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            {dstTxHash}
          </a>
        </div>
      )}
      {receivedMsg && (
        <div className="status">
          <strong>Received&nbsp;Message:</strong>&nbsp;{receivedMsg}
        </div>
      )}
    </>
  );
}

export default StatusInfo; 