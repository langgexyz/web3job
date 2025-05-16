const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    // 部署 LogicV1
    const LogicV1 = await ethers.getContractFactory("LogicV1");
    const logicV1 = await LogicV1.deploy();
    await logicV1.waitForDeployment();
    const logicV1Addr = await logicV1.getAddress();
    console.log("LogicV1 deployed to:", logicV1Addr);

    // 部署 LogicV2
    const LogicV2 = await ethers.getContractFactory("LogicV2");
    const logicV2 = await LogicV2.deploy();
    await logicV2.waitForDeployment();
    const logicV2Addr = await logicV2.getAddress();
    console.log("LogicV2 deployed to:", logicV2Addr);

    // 部署 Proxy
    const Proxy = await ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy(logicV1Addr);
    await proxy.waitForDeployment();
    const proxyAddr = await proxy.getAddress();
    console.log("Proxy deployed to:", proxyAddr);

    // 写入到 config.js
    const config = {
        logicV1Address: logicV1Addr,
        logicV2Address: logicV2Addr,
        proxyAddress: proxyAddr
    };

    const configPath = path.resolve(__dirname, "config.js");
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};\n`);
    console.log(`💾 Saved to config.js`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
