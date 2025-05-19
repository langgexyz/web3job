const {ethers, upgrades} = require("hardhat")
const {proxyAddress} = require("./config.js")
const path = require("path");
const fs = require("fs");

async function main() {
    const LockV2 = await ethers.getContractFactory("LockV2");

    // TODO uups 优点是不需要一个单独的ProxyAdmin，缺点是每个Proxy也需要一个一个的升级
    const proxy = await upgrades.upgradeProxy(proxyAddress, LockV2)
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