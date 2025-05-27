const hre = require("hardhat");
const {myGameAssetsAddress} = require("./config");

async function main() {
    const [deployer, user] = await hre.ethers.getSigners();
    const contract = await hre.ethers.getContractAt("MyGameAssets", myGameAssetsAddress, deployer);


    // mint tokenId = 1（金币），数量为 100
    const tx = await contract.mint(user.address, 1, 100, "0x");
    await tx.wait();
    console.log("Minted 100 of tokenId=1 to", user.address);
}

main().catch(console.error);
