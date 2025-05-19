const { ethers } = require("hardhat");
const {proxyAddress} = require("./config.js")

async function main() {
    const proxy = await ethers.getContractAt("LockV2", proxyAddress)
    const tx1 = await proxy.deposit({value:ethers.parseEther("0.01")})
    await tx1.wait();

    const tx2 = await proxy.deposit({ value: ethers.parseEther("0.02") });
    await tx2.wait();

    const value = await proxy.value();
    console.log("📊 当前 deposit 金额:", value.toString());
}

main().catch(console.error)