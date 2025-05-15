const hre = require("hardhat");
const config = require("./config");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const lockAddress = config.lockAddress;

    const Lock = await hre.ethers.getContractAt("Lock", lockAddress);

    // 读取解锁时间
    const unlockTime = Number(await Lock.unlockTime());
    const now = Math.floor(Date.now() / 1000);

    if (now < unlockTime) {
        const waitSec = unlockTime - now;
        console.log(`⏳ Unlock time not reached. Wait ${waitSec} seconds.`);
        return;
    }

    // 提取代币
    const tx = await Lock.withdraw();
    await tx.wait();
    console.log(`✅ Withdraw successful`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
