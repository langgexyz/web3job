const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const Factory = await hre.ethers.getContractFactory("MyGameAssets", deployer);
    const contract = await Factory.deploy();
    await contract.waitForDeployment();

    const myGameAssetsAddress = await contract.getAddress();
    console.log("Deployed MyGameAssets to:", myGameAssetsAddress);

    // 写入到 config.js
    const config = {
        myGameAssetsAddress: myGameAssetsAddress,
    };

    const configPath = path.resolve(__dirname, "config.js");
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};\n`);
    console.log(`💾 Saved to config.js`);
}

main().catch(console.error);
