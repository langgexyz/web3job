const { ethers } = require("hardhat");

async function main() {
    // TODO ethers 搞定了哪些事情？
    const [deployer] = await ethers.getSigners();
    const currentBlock = await ethers.provider.getBlock("latest");
    const unlockTime = currentBlock.timestamp + 300;
    console.log("Current block time:", currentBlock.timestamp);
    console.log("Unlock time set to:", unlockTime);

    const nonce = await ethers.provider.getTransactionCount(deployer.address)
    console.log("Deployer address:", deployer.address);
    console.log("Deployer nonce:", nonce);

    const predictedAddress = ethers.getCreateAddress({
        from: deployer.address,
        nonce: nonce,
    });
    console.log("Lock contract predicted address:", predictedAddress);

    const Lock = await ethers.getContractFactory("Lock");
    // TODO 部署时传入的 value 是什么意思？
    const lock = await Lock.deploy(unlockTime, {
        value: ethers.parseEther("0.01"),
    });

    await lock.waitForDeployment();

    const deployedAddress = await lock.getAddress();
    console.log("Lock contract deployed to:", deployedAddress);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
