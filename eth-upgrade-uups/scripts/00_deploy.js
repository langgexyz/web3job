const { ethers, upgrades } = require("hardhat");

async function main() {
    const Lock = await ethers.getContractFactory("Lock");
    const unlockTime = Math.floor(Date.now() / 1000) + 300;

    const lock = await upgrades.deployProxy(Lock, [unlockTime], {
        kind: "uups",
        initializer: "initialize"
    });

    await lock.waitForDeployment();
    console.log("✅ Proxy 部署成功：", await lock.getAddress());
}

main().catch(console.error);
