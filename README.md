# Cross-Chain Messaging DApp

A simple frontend DApp that allows users to send messages from one blockchain to another using the Hyperlane cross-chain messaging protocol.

---

## ✨ Features

- **Send messages** from one testnet to another ( here across same chain )
- **Select source and destination chains**
- **View real-time status updates** on message delivery
- **See transaction hashes** for both source and destination chains
- **Message history/logs** with timestamps
- **Simulation Mode** If MetaMask is not installed or the wallet is not connected: The app enters Simulation Mode

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended , for version lower then 20 it would throw crypto.hash error) 
- [MetaMask](https://metamask.io/) browser extension
- Testnet ETH on the source chain (get from a faucet)

### Installation

```bash
git clone https://github.com/nikhil767raj/cross-chain-messaging-dapp.git
cd cross-chain-messaging-dapp
npm install
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

**Supported Chains:**

- Ethereum Sepolia
- Arbitrum Sepolia
- Base Sepolia

---

## 📝 Usage
Here’s the updated usage guide with a note on cross-chain messaging limitations:

⸻

📝 Usage Guide

🔄 Simulation Mode

✅ No wallet connection required.

	1.	Enter a message in the input field.
	2.	Select any source and destination chains.
	3.	Click “Send Message”.
	4.	You’ll see mock transaction hashes for both source and destination, and a message delivery confirmation.
	5.	🛑 Note: These are simulated hashes and will not exist on any real network.
	6.	Check the History section for simulated transactions.

⸻

🔗 Real Mode – Same Chain (Loopback)

✅ Requires wallet connection (e.g., MetaMask).

	1.	Connect your wallet.
	2.	Enter your message.
	3.	Select the same chain for both source and destination (e.g., Ethereum Sepolia → Ethereum Sepolia).
	4.	Click “Send Message”.
	5.	You’ll see real transaction hashes and delivery confirmation.
	6.	Message is considered delivered in the same transaction, as no relayer is involved.
	7.	View your message and tx history below.

🚫 Cross-Chain Messaging (Between Different Chains)

⚠️ Currently Not Supported

	•	Cross-chain messaging (e.g., Ethereum Sepolia → Arbitrum Sepolia) requires a receiver contract to be deployed on the destination chain.
	•	If no receiver is deployed or relayers aren’t configured, the message won’t be delivered.
	•	Attempting cross-chain delivery will likely result in a message never appearing on the destination chain.

## 🛠️ Tech Stack

- React
- Hyperlane protocol

---

## 📄 Notes

- You must have testnet ETH on the source chain to send messages.
---
