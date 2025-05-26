const hre = require("hardhat");
const {myNFTAddress, nftVaultAddress} = require("./config");

// TODO 什么是ABI？什么是bytecode？
async function main() {
    const signers = await hre.ethers.getSigners();

    const myNFT = await hre.ethers.getContractAt("MyNFT", myNFTAddress);
    const tx = await myNFT.mint(signers[0].address)

    console.log("Mint transaction sent. Tx hash:", tx.hash);

    await tx.wait();
    console.log("Mint transaction confirmed.");
}

main().catch(console.error)