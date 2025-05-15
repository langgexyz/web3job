const hre = require("hardhat");
const { lockFactoryAddress } = require("./config");
const { keccak256, toUtf8Bytes } = hre.ethers;

async function main() {
    const [user] = await hre.ethers.getSigners();

    const factory = await hre.ethers.getContractAt("LockFactory", lockFactoryAddress);

    // 设置解锁时间为当前时间 + 1 小时
    const now = Math.floor(Date.now() / 1000);
    const unlockTime = now + 3600;

    // 自定义 salt（必须为 bytes32 类型）
    const salt = keccak256(toUtf8Bytes(`lock-${user.address}-${unlockTime}`));

    // 预测地址（CREATE2）
    const predicted = await factory.computeLockAddress(user.address, unlockTime, salt);
    console.log("Predicted Lock address:", predicted);

    const tx = await factory.connect(user).createLock3(unlockTime, salt, {
        value: hre.ethers.parseEther("1"),
    });
    const receipt = await tx.wait();

    // 解析事件日志
    const event = receipt.logs.find(log => log.fragment.name === "LockCreated");
    const actual = event.args.lockAddress;

    console.log("Actual Lock address    :", actual);
    console.log("Unlock Time (timestamp):", unlockTime);
    console.log("Tx Hash                :", tx.hash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
