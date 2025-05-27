const hre = require("hardhat");
const {myGameAssetsAddress} = require("./config");

async function main() {
    const [deployer, user, receiver] = await hre.ethers.getSigners();
    const contract = await hre.ethers.getContractAt("MyGameAssets", myGameAssetsAddress, user);

    const ids = [1, 10, 11, 12];
    const amounts = [0, 5, 1, 20];

    console.log("Checking user token balances before transfer:");
    for (let i = 0; i < ids.length; i++) {
        const balance = await contract.balanceOf(user.address, ids[i]);
        console.log(`  - tokenId=${ids[i]}: ${balance.toString()}`);
    }


    const tx = await contract.safeBatchTransferFrom(user.address, receiver.address, ids, amounts, "0x");
    await tx.wait();

    console.log(`Transferred batch tokens from ${user.address} to ${receiver.address}:`);
    ids.forEach((id, index) => {
        console.log(`  - tokenId=${id}, amount=${amounts[index]}`);
    });
}

main().catch(console.error);
