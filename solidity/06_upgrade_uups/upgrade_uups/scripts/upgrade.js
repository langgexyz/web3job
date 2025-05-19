const {ethers, upgrades} = require("hardhat")
const {proxyAddress} = require("./config.js")
const path = require("path");
const fs = require("fs");

async function main() {
    const Lock = await ethers.getContractFactory("LockV2");

    const proxy = await upgrades.upgradeProxy(proxyAddress, Lock)
    await proxy.waitForDeployment();

    const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress)
    const config = {
        proxyAddress:proxyAddress,
        implementationAddress:implementationAddress,
    }
    const configPath = path.resolve(__dirname, "config.js");
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};\n`);
    console.log(`💾 Saved to config.js`);
}

main().catch(console.error)