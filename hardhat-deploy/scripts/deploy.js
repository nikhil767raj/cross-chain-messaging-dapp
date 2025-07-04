const hre = require("hardhat");

async function main() {
    console.log("Deploying Receiver contract...");

    // Get the deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Arbitrum Sepolia mailbox address
    const ARBITRUM_SEPOLIA_MAILBOX = "0x598face78a4302f11e3de0bee1894da0b2cb71f8";

    // Deploy the Receiver contract
    const Receiver = await hre.ethers.getContractFactory("Receiver");
    const deploymentTx = await Receiver.getDeployTransaction(ARBITRUM_SEPOLIA_MAILBOX);
    const tx = await deployer.sendTransaction(deploymentTx);
    const receipt = await tx.wait();

    console.log("Deployment transaction hash:", tx.hash);
    console.log("Check this transaction on Arbiscan Sepolia to find the contract address:");
    console.log(`https://sepolia.arbiscan.io/tx/${tx.hash}`);

    const receiverAddress = receipt.contractAddress;
    console.log("Receiver deployed to:", receiverAddress);
    console.log("Mailbox address:", ARBITRUM_SEPOLIA_MAILBOX);

    console.log("Deployment completed!");
    console.log("Receiver contract address:", receiverAddress);
    console.log("Network:", hre.network.name);
    console.log("Chain ID:", hre.network.config.chainId);

    // Verify the contract on Arbiscan (if API key is provided)
    if (hre.network.name === "arbitrumSepolia" && process.env.ARBISCAN_API_KEY) {
        console.log("Verifying contract on Arbiscan...");
        try {
            await hre.run("verify:verify", {
                address: receiverAddress,
                constructorArguments: [ARBITRUM_SEPOLIA_MAILBOX],
            });
            console.log("Contract verified on Arbiscan!");
        } catch (error) {
            console.log("Verification failed:", error.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 