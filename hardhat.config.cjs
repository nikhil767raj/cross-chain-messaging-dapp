require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        arbitrumSepolia: {
            url: "https://sepolia-rollup.arbitrum.io/rpc",
            chainId: 421614,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
        sepolia: {
            url: "https://sepolia.infura.io/v3/2651d93c22644b5393e156b1b3ae1ec9",
            chainId: 11155111,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },
    etherscan: {
        apiKey: {
            arbitrumSepolia: process.env.ARBISCAN_API_KEY || "",
            sepolia: process.env.ETHERSCAN_API_KEY || "",
        },
        customChains: [
            {
                network: "arbitrumSepolia",
                chainId: 421614,
                urls: {
                    apiURL: "https://api-sepolia.arbiscan.io/api",
                    browserURL: "https://sepolia.arbiscan.io/",
                },
            },
        ],
    },
}; 