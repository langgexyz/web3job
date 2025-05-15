// scripts/createLock.js
const hre = require("hardhat");
const { lockFactoryAddress } = require("./config");

async function main() {
    const [user] = await hre.ethers.getSigners();

    const LockFactory = await hre.ethers.getContractFactory("LockFactory");
    const factory = LockFactory.attach(lockFactoryAddress);

    const unlockTime = Math.floor(Date.now() / 1000) + 3600; // 1小时后解锁
    const oneEther = hre.ethers.parseEther("1");

    const tx = await factory.createLock(unlockTime, {
        value: oneEther,
    });
    const receipt = await tx.wait();

    const event = receipt.logs.find(log => log.fragment.name === "LockCreated");
    const lockAddress = event.args.lockAddress;

    console.log(`✅ Lock created at: ${lockAddress}`);
    console.log(`🔓 Unlock time: ${unlockTime}`);
    console.log(`🔗 Tx hash: ${tx.hash}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
