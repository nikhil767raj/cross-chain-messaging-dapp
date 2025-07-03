import React, { useState, useEffect, useRef } from "react";
// The ethers library is expected to be globally available via a CDN script.
// test
// Define the chains, RPC URLs, and explorers as provided
const CHAINS = [
  {
    name: "Ethereum Sepolia",
    id: 11155111,
    domain: 11155111,
    mailbox: "0xcc737a94fecaec165abcf12ded095bb13f037685",
    receiver: "0x000000000000000000000000000000000000dead",
    igp: "0xe9e1cf1442e37bebf6ce102a7cb22bd556a9321f",
  },
  {
    name: "Arbitrum Sepolia",
    id: 421614,
    domain: 421614,
    mailbox: "0x598face78a4302f11e3de0bee1894da0b2cb71f8",
    receiver: "0x000000000000000000000000000000000000dead",
    igp: "0x53c52406d23c092e330a529d590ec96eace6cf5b",
  },
  {
    name: "Base Sepolia",
    id: 84532,
    domain: 84532,
    mailbox: "0x6966b0E55883d49BFB24539356a2f8A673E02039", // TODO: fill with real address
    receiver: "0x000000000000000000000000000000000000dead",
    igp: "0x0000000000000000000000000000000000000000", // TODO: fill with real address
  },
];

const RPC_URLS = {
  11155111: "https://sepolia.infura.io/v3/2651d93c22644b5393e156b1b3ae1ec9",
  421614: "https://sepolia-rollup.arbitrum.io/rpc",
  84532: "https://rpc.notadegen.com/base/sepolia",
};

const EXPLORERS = {
  11155111: "https://sepolia.etherscan.io/tx/",
  421614: "https://sepolia.arbiscan.io/",
  84532: "https://rpc.notadegen.com/base/sepolia",
};

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [sourceChain, setSourceChain] = useState(CHAINS[0].id);
  const [destChain, setDestChain] = useState(CHAINS[1].id);
  const [status, setStatus] = useState(
    "MetaMask or compatible wallet not detected."
  );
  const [srcTxHash, setSrcTxHash] = useState("");
  const [dstTxHash, setDstTxHash] = useState("");
  const [receivedMsg, setReceivedMsg] = useState("");
  const [history, setHistory] = useState([]);
  const [messageId, setMessageId] = useState("");
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const chatHistoryRef = useRef(null); // Ref for scrolling to the latest message

  // Function to show a custom modal alert
  const showMessageModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  // Function to close the custom modal alert
  const closeModal = () => {
    setShowModal(false);
    setModalContent("");
  };

  // Connect wallet function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Ensure ethers is loaded before using it
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

  // Helper function to generate a random hex string for simulated hashes
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

  // Send message function
  const sendMessage = async () => {
    // if (!walletAddress) {
    //   setStatus("Please connect your wallet to send a message.");
    //   showMessageModal("Please connect your wallet to send a message.");
    //   return;
    // }
    setStatus("Sending message...");
    setSrcTxHash("");
    setDstTxHash("");
    setReceivedMsg("");
    setMessageId("");

    try {
      const srcChainObj = CHAINS.find((c) => c.id === sourceChain);
      const dstChainObj = CHAINS.find((c) => c.id === destChain);

      if (!srcChainObj || !dstChainObj) {
        throw new Error("Invalid chain selection.");
      }
      if (sourceChain === destChain) {
        throw new Error("Source and Destination chains cannot be the same.");
      }

      // --- Simulation Mode if no wallet is connected ---
      if (!walletAddress) {
        showMessageModal(
          "Simulation mode: No wallet connected. The transaction hashes and message ID shown below are random and will NOT be found on Sepolia or any real network."
        );
        setStatus("Simulating message send (no wallet connected)...");
        const simulatedSrcTxHash = generateRandomHex(64);
        const simulatedMessageId = generateRandomHex(64);
        const simulatedDstTxHash = generateRandomHex(64);
        const simulatedRecipientAddress =
          "0x" + generateRandomHex(40).substring(2); // Mock address

        setSrcTxHash(simulatedSrcTxHash);
        setMessageId(simulatedMessageId);
        setStatus("Simulated message sent! Waiting for simulated delivery...");

        await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate network delay

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
        return; // Exit function after simulation
      }
      // --- End Simulation Mode ---

      // Ensure ethers is loaded before using it (for actual wallet interaction)
      if (!window.ethers) {
        throw new Error(
          "Ethers.js library not found. Please ensure it's loaded correctly."
        );
      }

      // Validate wallet address before proceeding
      if (!window.ethers.utils.isAddress(walletAddress)) {
        throw new Error(
          "Invalid or missing wallet address. Please connect your wallet."
        );
      }
      const checksummedWalletAddress =
        window.ethers.utils.getAddress(walletAddress);

      // Check if MetaMask is on the correct source chain
      const currentChainId = Number(window.ethereum.networkVersion);
      if (currentChainId !== sourceChain) {
        setStatus(`Please switch to ${srcChainObj.name} in MetaMask.`);
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + sourceChain.toString(16) }],
          });
          // After switching, give some time for the provider to update
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (switchError) {
          if (switchError.code === 4902) {
            // Chain not added
            showMessageModal(
              `Please add ${srcChainObj.name} to your MetaMask wallet.`
            );
          } else {
            showMessageModal(`Failed to switch chain: ${switchError.message}`);
          }
          setStatus(`Failed to switch to ${srcChainObj.name}.`);
          return; // Stop execution if chain switch fails
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

      // Mailbox ABI (minimal for dispatch and Process event)
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

      // ------------- PAY INTERCHAIN GAS -------------
      // const GAS_AMOUNT = 350_000; // upper-bound for a simple receive
      // const igp = new ethers.Contract(srcChainObj.igp, igpAbi, signer);
      // console.log("igp =", igp);

      // // // ask how much native ETH to send
      // const quoted = await igp.quoteGasPayment(destinationDomain, GAS_AMOUNT);

      // // pay it – without this the relayer will ignore the packet
      // const payTx = await igp.payForGas(
      //   msgId, // message to execute
      //   destinationDomain,
      //   GAS_AMOUNT,
      //   walletAddress, // refund any surplus to the sender
      //   { value: quoted } // ← ETH payment
      // );
      // await payTx.wait();
      // ----------------------------------------------

      // Send the message
      const tx = await mailbox.dispatch(
        destinationDomain,
        recipientAddress,
        messageBytes
      );
      setSrcTxHash(tx.hash);
      setStatus("Message sent! Waiting for confirmation on source chain...");

      const receipt = await tx.wait();
      let msgId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = mailbox.interface.parseLog(log);
          if (parsed.name === "Dispatch") {
            msgId = parsed.args.messageId;
            break;
          }
        } catch (e) {
          // Ignore logs that are not from the mailbox interface
        }
      }
      if (msgId) setMessageId(msgId);
      setStatus(
        "Message confirmed on source chain! Listening for delivery on destination chain..."
      );

      // Poll destination chain for Process event
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

      // Poll for up to 2 minutes
      let found = false;
      const pollingAttempts = 24; // 24 attempts * 5 seconds = 120 seconds (2 minutes)
      for (let i = 0; i < pollingAttempts; i++) {
        setStatus(
          `Waiting for message on destination chain... (${(i + 1) * 5}s)`
        );
        // Filter by messageId if available, otherwise by origin and destination
        const filter = msgId
          ? dstMailbox.filters.Process(msgId)
          : dstMailbox.filters.Process(null, sourceChain, destinationDomain);

        // Query last 500 blocks to catch recent events
        const events = await dstMailbox.queryFilter(filter, -500);

        // Find event with matching recipient and message in JS
        const event = events.find(
          (e) =>
            e.args &&
            e.args.recipient.toLowerCase() === recipientAddress.toLowerCase() && // Case-insensitive comparison
            window.ethers.utils.toUtf8String(e.args.message) === message &&
            (msgId ? e.args.messageId === msgId : true) // Ensure messageId matches if known
        );

        if (event) {
          setDstTxHash(event.transactionHash);
          setReceivedMsg(message);
          setStatus("Message received on destination chain!");
          found = true;
          setHistory((prev) => [
            {
              id: event.args.messageId || Date.now().toString(), // Fallback ID if messageId is null
              text: message,
              srcTx: tx.hash, // Use the source transaction hash
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
        await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds before next poll
      }
      if (!found) {
        setStatus(
          "Message not found on destination chain after 2 minutes. It might be delayed or an issue occurred."
        );
      }
    } catch (err) {
      const errorMessage =
        err.reason || err.message || "An unknown error occurred.";
      setStatus(`Error: ${errorMessage}`);
      showMessageModal(`Error sending or receiving message: ${errorMessage}`);
      console.error("Error in sendMessage:", err);
    }
  };

  // Scroll to the latest message when history updates
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (sourceChain === destChain) {
      const other = CHAINS.find((c) => c.id !== sourceChain);
      if (other) setDestChain(other.id);
    }
  }, [sourceChain, destChain]);

  return (
    <div className="app-wrapper">
      {/* ─────────── Modal ─────────── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{modalContent}</p>
            <button onClick={closeModal}>Got It!</button>
          </div>
        </div>
      )}
      <div className="card">
        {/* ─────────── Title ─────────── */}
        <h1 className="heading">Cross-Chain Messenger</h1>

        {/* ─────────── Wallet button ─────────── */}
        <button onClick={connectWallet} className="connect-btn">
          {walletAddress
            ? `Connected: ${walletAddress.slice(0, 6)}…${walletAddress.slice(
                -4
              )}`
            : "Connect Wallet"}
        </button>

        {/* ─────────── Message input ─────────── */}
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

        {/* ─────────── Chain selectors ─────────── */}
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
              {CHAINS.filter((c) => c.id !== sourceChain).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ─────────── Send button ─────────── */}
        <button
          onClick={sendMessage}
          className="send-btn"
          disabled={!message.trim() || sourceChain === destChain}
        >
          Send Message
        </button>

        {/* ─────────── Status box ─────────── */}
        {status && (
          <div className="status">
            Status: <strong>{status}</strong>
          </div>
        )}

        {/* ─────────── Tx / IDs / Received msg ─────────── */}
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

        {/* ─────────── User ID box ─────────── */}
        <div className="user-id-box">
          Your User ID:{" "}
          <span className="user-id-address">
            {walletAddress || "Connect wallet to see ID"}
          </span>
        </div>

        {/* ─────────── History ─────────── */}
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
