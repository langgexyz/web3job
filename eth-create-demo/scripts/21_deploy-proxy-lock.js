const { ethers, upgrades } = require("hardhat");

async function main() {
    const LockV1 = await ethers.getContractFactory("LockV1");
    const unlockTime = Math.floor(Date.now() / 1000) + 300;

    const lock = await upgrades.deployProxy(LockV1, [unlockTime], {
        initializer: "initialize",
        value: ethers.parseEther("0.01"),
    });

    await lock.waitForDeployment();
    console.log("✅ Proxy 部署成功：", await lock.getAddress());
}

main().catch(console.error);
