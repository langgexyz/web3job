const { ethers } = require("hardhat");

async function main() {
    const proxyAddress = "0x59b670e9fA9D0A427751Af201D676719a970857b";

    const LockV2 = await ethers.getContractAt("LockV2", proxyAddress);
    // TODO 如果访问一个没有的方法会出现什么错误？
    // 如：TypeError: LockV2.getLeftTim is not a function，Ethers.js 尝试找你要调用的函数名（ABI 层），但是 ABI 没有定义
    // TODO ABI 是什么？JS 中调用 ABI 有哪几种方式？
    /** 方式一
     * const Box = await ethers.getContractAt("Box", proxyAddress);
     * Box 的 ABI 会自动加载
     */
    /** 方式二
     * const abi = require("../artifacts/contracts/Box.sol/Box.json").abi;
     * const box = new ethers.Contract(proxyAddress, abi, signer);
     */
    const left = await LockV2.getLeftTime();

    console.log("⏳ 剩余解锁时间：", left.toString(), "秒");
}

main().catch(console.error);
