const hre = require("hardhat");
const {myNFTAddress, nftVaultAddress} = require("./config");

// TODO 什么是ABI？什么是bytecode？
async function main() {
    const signers = await hre.ethers.getSigners();
    if (signers.length < 2) {
        throw new Error("At least two signers are required: one for deployer, one for user.");
    }

    const deployer = signers[0];
    const user = signers[signers.length - 1];

    const myNFT = await hre.ethers.getContractAt("MyNFT", myNFTAddress, deployer);
    // TODO 如何知道nftid是多少？
    const tx = await myNFT.mint(user.address)

    console.log("Mint transaction sent. Tx hash:", tx.hash);

    const receipt = await tx.wait();
    console.log("Mint transaction confirmed.");

    const iface = myNFT.interface;
    const logs = receipt.logs
        .map(log => {
            try {
                return iface.parseLog(log);
            } catch {
                return null;
            }
        })
        .filter(log => log && log.name === "Transfer");

    if (logs.length === 0) {
        throw new Error("Transfer event not found.");
    }

    const tokenId = logs[0].args.tokenId;
    console.log("Minted tokenId:", tokenId.toString());
}

main().catch(console.error)