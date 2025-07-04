# Cross-Chain Messaging DApp

A simple frontend DApp that allows users to send messages from one blockchain to another using the Hyperlane cross-chain messaging protocol.

---

## ✨ Features

- **Send messages** from one testnet to another ( here across same chain )
- **Select source and destination chains**
- **View real-time status updates** on message delivery
- **See transaction hashes** for both source and destination chains
- **Message history/logs** with timestamps
- **Simulation Mode** If MetaMask is not installed or the wallet is not connected:
The app enters Simulation Mode
Messages will appear to send, showing mock transaction hashes and status
- Note: Simulation does not involve real chain communication or actual testnet tokens.
---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [MetaMask](https://metamask.io/) browser extension
- Testnet ETH on the source chain (get from a faucet)
- Try this : - https://cloud.google.com/application/web3/faucet/ethereum/sepolia


### Installation

```bash
git clone <your-repo-url>
cd cross-chain-messaging-dapp
npm install
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Configuration

All contract addresses and RPC URLs are hardcoded in `src/App.jsx`.  

**Supported Chains:**

- Ethereum Sepolia
- Arbitrum Sepolia
- Base Sepolia

---

## 📝 Usage

1. **Connect your wallet** (MetaMask).
2. **Enter a message** in the input box.
3. **Select source and destination chains.**
4. **Click "Send Message".**
5. Watch real-time status updates and see both transaction hashes and the delivered message.
6. View your message history at the bottom of the page.

---

## 🛠️ Tech Stack

- React
- ethers.js
- Hyperlane protocol

---

## 📄 Notes

- You must have testnet ETH on the source chain to send messages.
---
