const {ethers, upgrades} = require("hardhat")
const {proxyAddress} = require("./config.js")
const path = require("path");
const fs = require("fs");
async function main() {
    const LockV2 = await ethers.getContractFactory("LockV2")

    const addressAddress = await upgrades.erc1967.getAdminAddress(proxyAddress)
    const lockV1Address = await upgrades.erc1967.getImplementationAddress(proxyAddress)

    const lockV2 = await upgrades.upgradeProxy(proxyAddress, LockV2, {
        initializer: "initialize",
        value: ethers.parseEther("0.01"),
    })
    await lockV2.waitForDeployment();

    const lockV2Address = await upgrades.erc1967.getImplementationAddress(proxyAddress)

    const config = {
        proxyAddress:proxyAddress,
        lockV1Address:lockV1Address,
        addressAddress:addressAddress,
        lockV2Address:lockV2Address,
    }
    const configPath = path.resolve(__dirname, "config.js");
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};\n`);
    console.log(`💾 Saved to config.js`);
}

main().catch(console.error)