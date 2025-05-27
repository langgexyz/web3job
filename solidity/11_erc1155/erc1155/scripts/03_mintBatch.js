const hre = require("hardhat");
const {myGameAssetsAddress} = require("./config");

async function main() {
    const [deployer, user] = await hre.ethers.getSigners();
    const contract = await hre.ethers.getContractAt("MyGameAssets", myGameAssetsAddress, deployer);

    const ids = [10, 11, 12];
    const amounts = [100, 50, 20];
    const tx = await contract.mintBatch(user.address, ids, amounts, "0x");
    await tx.wait();

    console.log(`Minted batch tokens to ${user.address}:`);
    ids.forEach((id, index) => {
        console.log(`  - tokenId=${id}, amount=${amounts[index]}`);
    });
}

main().catch(console.error);
