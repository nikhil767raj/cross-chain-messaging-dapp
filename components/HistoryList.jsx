import { EXPLORERS } from "../constants/explorer";

export default function HistoryList({ history }) {
  if (!history.length) return null;
  return (
    <div className="history">
      {history.map((h) => (
        <div key={h.id} className="history-item">
          <p><strong>{h.text}</strong> ({h.srcChain} → {h.dstChain})</p>
          <p>
            Src: <a className="tx-link" href={`${EXPLORERS[h.srcChainId]}${h.srcTx}`} target="_blank" rel="noreferrer">{h.srcTx.slice(0,10)}…</a>
          </p>
          <p>
            Dst: <a className="tx-link" href={`${EXPLORERS[h.dstChainId]}${h.dstTx}`} target="_blank" rel="noreferrer">{h.dstTx.slice(0,10)}…</a>
          </p>
          <p>{new Date(h.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}