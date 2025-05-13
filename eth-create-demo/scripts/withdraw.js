const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    // TODO 请将此地址替换为你部署后的 Lock 合约地址
    const lockAddress = "0x591bbe40Ef476FeAa35F7E099BF859d74E572021";

    const Lock = await ethers.getContractAt("Lock", lockAddress);

    const unlockTime = await Lock.unlockTime();
    const currentTime = Math.floor(Date.now() / 1000);

    console.log("Unlock time      :", unlockTime.toString());
    console.log("Current timestamp:", currentTime);

    if (currentTime < unlockTime) {
        const waitTime = unlockTime - BigInt(currentTime);
        console.log(`⏳ 当前尚未到解锁时间，需等待 ${waitTime} 秒后再试`);
        return;
    }

    console.log("✅ 调用 withdraw() 中...");
    const tx = await Lock.withdraw();
    const receipt = await tx.wait();

    console.log("🎉 提款成功，交易哈希：", receipt.hash);
}

main().catch((error) => {
    console.error("❌ 出错：", error);
    process.exit(1);
});
