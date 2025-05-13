const { ethers } = require("hardhat");

async function main() {
    const Factory = await ethers.getContractFactory("LockFactory");
    const factory = await Factory.deploy();
    await factory.waitForDeployment();

    const address = await factory.getAddress();
    console.log("✅ LockFactory 已部署：", address);
}

main().catch(console.error);
