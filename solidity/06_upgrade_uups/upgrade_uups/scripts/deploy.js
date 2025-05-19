const {ethers, upgrades} = require("hardhat")
const path = require("path");
const fs = require("fs");

async function main() {
    const Lock = await ethers.getContractFactory("Lock");
    const unlockTime = Math.floor(Date.now() / 1000) + 300;

    const proxy = await upgrades.deployProxy(Lock, [unlockTime], {
        initializer:"initialize",
        kind:"uups",
        value: ethers.parseEther("0.01"),
    })
    await proxy.waitForDeployment();

    const proxyAddress = await proxy.getAddress();

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