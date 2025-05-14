const { ethers } = require("hardhat");

async function main() {
    const proxyAddress = "0x4A679253410272dd5232B3Ff7cF5dbB88f295319";

    const LockV2 = await ethers.getContractAt("LockV2", proxyAddress);
    const left = await LockV2.getLeftTime();

    console.log("⏳ 剩余解锁时间：", left.toString(), "秒");
}

main().catch(console.error);
