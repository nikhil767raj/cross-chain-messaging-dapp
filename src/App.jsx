import React, { useState, useRef } from "react";
const CHAINS = [
 {
 name: "Ethereum Sepolia",
 id: 11155111,
 domain: 11155111,
 mailbox: "0xcc737a94fecaec165abcf12ded095bb13f037685",
 receiver: "0xc0DeD9245bCc36acB6aBF2c8d2719c5E02c78353",
 igp: "0xe9e1cf1442e37bebf6ce102a7cb22bd556a9321f",
 },
 {
 name: "Arbitrum Sepolia",
 id: 421614,
 domain: 421614,
 mailbox: "0x598face78a4302f11e3de0bee1894da0b2cb71f8",
 receiver: "0x000000000000000000000000000000000000dead", // TODO: fill with real address becoz not deployed Receiver contract
 igp: "0x53c52406d23c092e330a529d590ec96eace6cf5b",
 },
 {
 name: "Base Sepolia",
 id: 84532,
 domain: 84532,
 mailbox: "0x6966b0E55883d49BFB24539356a2f8A673E02039",
 receiver: "0x000000000000000000000000000000000000dead",
 igp: "0x0000000000000000000000000000000000000000", // TODO: fill with real address becoz not deployed Receiver contract
 },
];

const RPC_URLS = {
 11155111: "https://sepolia.infura.io/v3/2651d93c22644b5393e156b1b3ae1ec9",
 421614: "https://sepolia-rollup.arbitrum.io/rpc",
 84532: "https://base-sepolia-rpc.publicnode.com",
};

const EXPLORERS = {
 11155111: "https://sepolia.etherscan.io/tx/",
 421614: "https://sepolia.arbiscan.io/",
 84532: "https://sepolia.basescan.org/",
};

function App() {
 const [walletAddress, setWalletAddress] = useState("");
 const [message, setMessage] = useState("");
 const [sourceChain, setSourceChain] = useState(CHAINS[0].id);
 const [destChain, setDestChain] = useState(CHAINS[0].id);
 const [status, setStatus] = useState(
 "MetaMask or compatible wallet not detected."
 );
 const [srcTxHash, setSrcTxHash] = useState("");
 const [dstTxHash, setDstTxHash] = useState("");
 const [receivedMsg, setReceivedMsg] = useState("");
 const [history, setHistory] = useState([]);
 const [messageId, setMessageId] = useState("");
 const [showModal, setShowModal] = useState(false);
 const [modalContent, setModalContent] = useState("");

 const chatHistoryRef = useRef(null);
 const showMessageModal = (content) => {
 setModalContent(content);
 setShowModal(true);
 };

 const closeModal = () => {
 setShowModal(false);
 setModalContent("");
 };

 const connectWallet = async () => {
 if (window.ethereum) {
 try {
 if (!window.ethers) {
 showMessageModal(
 "Ethers.js library not found. Please ensure it's loaded correctly."
 );
 return;
 }
 const accounts = await window.ethereum.request({
 method: "eth_requestAccounts",
 });
 if (accounts.length > 0) {
 const canonical = window.ethers.utils.getAddress(accounts[0]);
 console.log("canonical", canonical);
 setWalletAddress(canonical);
 setStatus("Wallet connected successfully!");
 } else {
 setStatus("No accounts found.");
 }
 } catch (err) {
 console.error("Wallet connection failed:", err);
 setStatus(`Wallet connection failed: ${err.message}`);
 showMessageModal(`Wallet connection failed: ${err.message}`);
 }
 } else {
 setStatus("MetaMask or compatible wallet not detected.");
 showMessageModal(
 "Please install MetaMask or a compatible Ethereum wallet."
 );
 }
 };

 const generateRandomHex = (length) => {
 let result = "0x";
 const characters = "abcdef0123456789";
 for (let i = 0; i < length; i++) {
 result += characters.charAt(
 Math.floor(Math.random() * characters.length)
 );
 }
 return result;
 };

 const sendMessage = async () => {
 setStatus("Please click Confirm in your wallet to send the message.");
 setSrcTxHash("");
 setDstTxHash("");
 setReceivedMsg("");
 setMessageId("");

 try {
 const srcChainObj = CHAINS.find((c) => c.id === sourceChain);
 const dstChainObj = CHAINS.find((c) => c.id === destChain);

 if (sourceChain === 11155111 && destChain === 11155111) {
 // Ethereum Sepolia loopback
 showMessageModal(
 <div>
 <div
 style={{
 textAlign: "center",
 fontWeight: "bold",
 marginBottom: "0.5em",
 }}
 >
 You have selected the same network for both source and
 destination.
 </div>
 <ul style={{ textAlign: "left" }}>
 <li>
 Due to testnet ETH limitations (unable to purchase ETH for
 Arbitrum Sepolia or Base Sepolia), this demo only supports{" "}
 <strong>Sepolia-to-Sepolia (loopback)</strong> messaging.
 </li>
 <li>
 This allows you to see{" "}
 <strong>
 both the source and destination transaction hashes
 </strong>{" "}
 on the same network.
 </li>
 </ul>
 </div>
 );
 } else if (sourceChain === 421614 && destChain === 421614) {
 // Arbitrum Sepolia loopback
 showMessageModal(
 <div>
 <div
 style={{
 textAlign: "center",
 fontWeight: "bold",
 marginBottom: "0.5em",
 }}
 >
 You have selected Arbitrum Sepolia for both source and
 destination.
 </div>
 <ul style={{ textAlign: "left" }}>
 <li>
 This demo cannot proceed because you do not have testnet ETH on
 Arbitrum Sepolia.
 </li>
 <li>
 Please use Ethereum Sepolia for the demo, or acquire testnet ETH
 for Arbitrum Sepolia.
 </li>
 </ul>
 </div>
 );
 } else if (sourceChain === 84532 && destChain === 84532) {
 // Base Sepolia loopback
 showMessageModal(
 <div>
 <div
 style={{
 textAlign: "center",
 fontWeight: "bold",
 marginBottom: "0.5em",
 }}
 >
 You have selected Base Sepolia for both source and destination.
 </div>
 <ul style={{ textAlign: "left" }}>
 <li>
 This demo cannot proceed because you do not have testnet ETH on
 Base Sepolia.
 </li>
 <li>
 Please use Ethereum Sepolia for the demo, or acquire testnet ETH
 for Base Sepolia.
 </li>
 </ul>
 </div>
 );
 } else {
 showMessageModal(
 <div>
 <div
 style={{
 textAlign: "center",
 fontWeight: "bold",
 marginBottom: "0.5em",
 }}
 >
 You have selected different source and destination networks:
 </div>
 <ul style={{ textAlign: "left", margin: "0.5em 0 0 1.5em" }}>
 <li>
 Due to lack of testnet ETH and no deployed receiver contract on
 the destination chain,
 </li>
 <li>
 <strong>The cross-chain message cannot be delivered</strong> and
 a destination transaction hash will not appear.
 </li>
 </ul>
 </div>
 );
 }

 if (!walletAddress) {
 showMessageModal(
 <div>
 <div
 style={{
 textAlign: "center",
 fontWeight: "bold",
 marginBottom: "0.5em",
 }}
 >
 Simulation mode: No wallet connected.
 </div>
 <ul style={{ textAlign: "left" }}>
 <li>
 The transaction hashes and message ID shown below are random.
 </li>
 <li>
 They will <strong>NOT</strong> be found on Sepolia or any real
 network.
 </li>
 </ul>
 </div>
 );
 setStatus("Simulating message send (no wallet connected)...");
 const simulatedSrcTxHash = generateRandomHex(64);
 const simulatedMessageId = generateRandomHex(64);
 const simulatedDstTxHash = generateRandomHex(64);
 const simulatedRecipientAddress =
 "0x" + generateRandomHex(40).substring(2);

 setSrcTxHash(simulatedSrcTxHash);
 setMessageId(simulatedMessageId);
 setStatus("Simulated message sent! Waiting for simulated delivery...");

 await new Promise((resolve) => setTimeout(resolve, 3000));

 setDstTxHash(simulatedDstTxHash);
 setReceivedMsg(message);
 setStatus("Simulated message received on destination chain!");

 setHistory((prev) => [
 {
 id: simulatedMessageId,
 text: message,
 srcTx: simulatedSrcTxHash,
 dstTx: simulatedDstTxHash,
 messageId: simulatedMessageId,
 timestamp: Date.now(),
 srcChain: srcChainObj.name,
 dstChain: dstChainObj.name,
 srcChainId: srcChainObj.id,
 dstChainId: dstChainObj.id,
 },
 ...prev,
 ]);
 return;
 }

 if (!window.ethers) {
 throw new Error(
 "Ethers.js library not found. Please ensure it's loaded correctly."
 );
 }

 if (!window.ethers.utils.isAddress(walletAddress)) {
 throw new Error(
 "Invalid or missing wallet address. Please connect your wallet."
 );
 }
 const checksummedWalletAddress =
 window.ethers.utils.getAddress(walletAddress);

 const currentChainId = Number(window.ethereum.networkVersion);
 if (currentChainId !== sourceChain) {
 setStatus(`Please switch to ${srcChainObj.name} in MetaMask.`);
 try {
 await window.ethereum.request({
 method: "wallet_switchEthereumChain",
 params: [{ chainId: "0x" + sourceChain.toString(16) }],
 });
 await new Promise((resolve) => setTimeout(resolve, 1000));
 } catch (switchError) {
 if (switchError.code === 4902) {
 showMessageModal(
 `Please add ${srcChainObj.name} to your MetaMask wallet.`
 );
 } else {
 showMessageModal(`Failed to switch chain: ${switchError.message}`);
 }
 setStatus(`Failed to switch to ${srcChainObj.name}.`);
 return;
 }
 }

 const provider = new window.ethers.providers.Web3Provider(
 window.ethereum
 );
 const signer = provider.getSigner();

 const igpAbi = [
 "function quoteGasPayment(uint32 destination,uint256 gas) view returns (uint256)",
 "function payForGas(bytes32 messageId,uint32 destination,uint256 gas,address refund) payable",
 ];

 const mailboxAbi = [
 "function dispatch(uint32 destinationDomain, bytes32 recipientAddress, bytes message) external returns (bytes32)",
 "event Dispatch(bytes32 indexed messageId, uint32 indexed origin, uint32 indexed destination, bytes32 recipient, bytes message, address caller)",
 "event Process(bytes32 indexed messageId, uint32 indexed origin, uint32 indexed destination, bytes32 recipient, bytes message, address caller)",
 ];

 const destinationDomain = dstChainObj.domain;
 const recipientAddress = window.ethers.utils.hexZeroPad(
 checksummedWalletAddress,
 32
 );
 const messageBytes = window.ethers.utils.toUtf8Bytes(message);

 const mailbox = new window.ethers.Contract(
 window.ethers.utils.getAddress(srcChainObj.mailbox),
 mailboxAbi,
 signer
 );
 // const tx = await mailbox.dispatch(
 // destinationDomain,
 // recipientAddress,
 // messageBytes
 // );
 // setSrcTxHash(tx.hash);
 // setStatus("Message sent! Waiting for confirmation on source chain...");

 // 1️⃣ predict
 const predictedId = await mailbox.callStatic.dispatch(
 destinationDomain,
 recipientAddress,
 messageBytes
 );
 const tx = await mailbox.dispatch(
 destinationDomain,
 recipientAddress,
 messageBytes
 );
 setSrcTxHash(tx.hash);
 setMessageId(predictedId);
 setStatus("Sent – waiting for source confirmation…");
 const receipt = await tx.wait();
 if (sourceChain === destChain) {
 /* loop-back: no relayer => we consider it delivered immediately */
 setDstTxHash(tx.hash);
 setReceivedMsg(message);
 setStatus("✅ Loop-back message considered delivered (same tx).");
 setHistory((prev) => [
 {
 id: predictedId,
 text: message,
 srcTx: tx.hash,
 dstTx: tx.hash,
 messageId: predictedId,
 timestamp: Date.now(),
 srcChain: srcChainObj.name,
 dstChain: dstChainObj.name,
 srcChainId: srcChainObj.id,
 dstChainId: dstChainObj.id,
 },
 ...prev,
 ]);
 return;
 }

 const dstProviderUrl = RPC_URLS[destChain];
 if (!dstProviderUrl) {
 throw new Error(
 `No RPC URL configured for destination chain ID: ${destChain}`
 );
 }
 const dstProvider = new window.ethers.providers.JsonRpcProvider(
 dstProviderUrl
 );
 const dstMailbox = new window.ethers.Contract(
 window.ethers.utils.getAddress(dstChainObj.mailbox),
 mailboxAbi,
 dstProvider
 );

 let found = false;
 const pollingAttempts = 12;
 for (let i = 0; i < pollingAttempts; i++) {
 setStatus(
 `Waiting for message on destination chain... (${(i + 1) * 5}s)`
 );
 const filter = dstMailbox.filters.Process(
 predictedId,
 srcChainObj.domain,
 dstChainObj.domain
 );
 // const fromBlock = receipt.blockNumber + 1;
 // const events = await dstMailbox.queryFilter(filter, 0, "latest");
 const events = await dstMailbox.queryFilter(filter, 0, "latest");
 console.log("filter", filter);
 console.log("dstMailbox", dstMailbox);
 // console.log("msgId", msgId);
 console.log("sourceChain", sourceChain);
 console.log("destinationDomain", destinationDomain);
 console.log("recipientAddress", recipientAddress);
 console.log("message", message);
 console.log("tx.hash", tx.hash);
 console.log("tx", tx);

 console.log("events", events);
 const event = events.find(
 (e) =>
 e.args &&
 e.args.recipient.toLowerCase() === recipientAddress.toLowerCase() && // Case-insensitive comparison
 window.ethers.utils.toUtf8String(e.args.message) === message // Ensure messageId matches if known
 );

 if (event) {
 setDstTxHash(event.transactionHash);
 setReceivedMsg(message);
 setStatus("Message received on destination chain!");
 found = true;
 setHistory((prev) => [
 {
 id: predictedId,
 text: message,
 srcTx: tx.hash,
 dstTx: event.transactionHash,
 messageId: event.args.messageId,
 timestamp: Date.now(),
 srcChain: srcChainObj.name,
 dstChain: dstChainObj.name,
 srcChainId: srcChainObj.id,
 dstChainId: dstChainObj.id,
 },
 ...prev,
 ]);
 break;
 }
 await new Promise((res) => setTimeout(res, 5000));
 }
 if (!found) {
 setStatus(
 "Message not found on destination chain after 2 minutes. It might be delayed or an issue occurred."
 );
 }

 const allEvents = await dstMailbox.queryFilter(
 "Process",
 receipt.blockNumber,
 "latest"
 );
 console.log("All Process events:", allEvents);
 } catch (err) {
 const errorMessage =
 err.reason || err.message || "An unknown error occurred.";
 setStatus(`Error: ${errorMessage}`);
 // showMessageModal(`Error sending or receiving message: ${errorMessage}`);
 console.error("Error in sendMessage:", err);
 }
 };
 return (
 <div className="app-wrapper">
 {showModal && (
 <div className="modal-overlay">
 <div className="modal">
 <p>{modalContent}</p>
 <button onClick={closeModal}>Got It!</button>
 </div>
 </div>
 )}
 <div className="card">
 <h1 className="heading">Cross-Chain Messenger</h1>

 <button onClick={connectWallet} className="connect-btn">
 {walletAddress
 ? `Connected: ${walletAddress.slice(0, 6)}…${walletAddress.slice(
 -4
 )}`
 : "Connect Wallet"}
 </button>

 <div className="form-group">
 <label htmlFor="message">Message:</label>
 <input
 id="message"
 type="text"
 value={message}
 onChange={(e) => setMessage(e.target.value)}
 placeholder="Enter your message"
 />
 </div>

 <div className="select-row">
 <div className="form-group">
 <label htmlFor="sourceChain">Source Chain:</label>
 <select
 id="sourceChain"
 value={sourceChain}
 onChange={(e) => setSourceChain(Number(e.target.value))}
 >
 {CHAINS.map((c) => (
 <option key={c.id} value={c.id}>
 {c.name}
 </option>
 ))}
 </select>
 </div>
 <div className="form-group">
 <label htmlFor="destChain">Destination Chain:</label>
 <select
 id="destChain"
 value={destChain}
 onChange={(e) => setDestChain(Number(e.target.value))}
 >
 {CHAINS.map((c) => (
 <option key={c.id} value={c.id}>
 {c.name}
 </option>
 ))}
 </select>
 </div>
 </div>

 <button onClick={sendMessage} className="send-btn" disabled={false}>
 Send Message
 </button>

 {status && (
 <div className="status">
 Status: <strong>{status}</strong>
 </div>
 )}

 {srcTxHash && (
 <div className="status">
 Source Tx:&nbsp;
 <a
 href={`${EXPLORERS[sourceChain]}${srcTxHash}`}
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
 href={`${EXPLORERS[destChain]}${dstTxHash}`}
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

 <div className="user-id-box">
 Your User ID:{" "}
 <span className="user-id-address">
 {walletAddress || "Connect wallet to see ID"}
 </span>
 </div>

 {history.length > 0 && (
 <div className="history" ref={chatHistoryRef}>
 {history.map((h) => (
 <div key={h.id} className="history-item">
 <p>
 <strong>{h.text}</strong>&nbsp;(
 {h.srcChain} → {h.dstChain})
 </p>
 <p>
 Src:&nbsp;
 <a
 href={`${EXPLORERS[h.srcChainId]}${h.srcTx}`}
 target="_blank"
 rel="noopener noreferrer"
 className="tx-link"
 >
 {h.srcTx.slice(0, 10)}…{/* ellipsis */}
 </a>
 </p>
 <p>
 Dst:&nbsp;
 <a
 href={`${EXPLORERS[h.dstChainId]}${h.dstTx}`}
 target="_blank"
 rel="noopener noreferrer"
 className="tx-link"
 >
 {h.dstTx.slice(0, 10)}…
 </a>
 </p>
 <p>{new Date(h.timestamp).toLocaleString()}</p>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}

export default App;