const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    // 👇 替换为你刚部署的 LockFactory 地址
    const factoryAddress = "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE";

    const factory = await ethers.getContractAt("LockFactory", factoryAddress);

    const unlockTime = Math.floor(Date.now() / 1000) + 300;

    console.log("🚀 调用工厂部署 Lock...");
    const tx = await factory.createLock(unlockTime, {
        value: ethers.parseEther("0.01"),
    });
    const receipt = await tx.wait();

    const event = receipt.logs.find(log => log.eventName === "LockCreated");
    const createdAddress = event?.args?.lockAddress;

    console.log("🎉 Lock 合约已部署：", createdAddress);
}

main().catch(console.error);
