const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("CREATE2Deployer");
    const factory = await Factory.deploy();
    await factory.waitForDeployment();

    const factoryAddress = await factory.getAddress();
    console.log("✅ CREATE2 工厂部署成功");
    console.log("Factory address:", factoryAddress);
}

main().catch(console.error);
