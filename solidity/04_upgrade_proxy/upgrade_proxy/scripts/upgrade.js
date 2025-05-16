const { ethers } = require("hardhat");
const { proxyAddress, logicV1Address, logicV2Address } = require("./config");

async function main() {
    const proxy = await ethers.getContractAt("Proxy", proxyAddress);

    // 升级到 LogicV1 并验证行为
    await proxy.upgrade(logicV1Address);
    const proxyAsV1 = await ethers.getContractAt("LogicV1", proxyAddress);
    await proxyAsV1.setX(10);
    const x1 = await proxyAsV1.x();
    console.log(`x after LogicV1.setX(10): ${x1.toString()}`); // 预期输出：10

    // 升级到 LogicV2 并验证行为
    await proxy.upgrade(logicV2Address);
    const proxyAsV2 = await ethers.getContractAt("LogicV2", proxyAddress);
    await proxyAsV2.setX(10);
    const x2 = await proxyAsV2.x();
    console.log(`x after LogicV2.setX(10): ${x2.toString()}`); // 预期输出：20
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});