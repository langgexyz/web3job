const {ethers} = require("hardhat");
const {proxyAddress, lockV2Address} = require("./config")

/*
  Proxy 合约通过delegatecall 调用 Lock 合约，其中msg.sender 是合约地址还是signer地址？
  1. delegatecall 会在 调用者的上下文（即 Proxy） 中执行目标合约（Logic）的代码；
  2. 所有的 msg.sender、msg.value 等上下文变量都 保留原始调用者的信息，不会因为进入了逻辑合约而改变。
 */
async function main() {
    const Proxy = await ethers.getContractAt("LockV2", proxyAddress);
    await Proxy.on("DebugAddress", (label, addr) => {
        console.log(`${label}: ${addr}`);
    });

    const tx = await Proxy.withdraw();
    const receipt = await tx.wait();
    console.log("🎉 提款成功，交易哈希：", receipt.hash);
}

main().catch(console.error)