// scripts/deploy.js
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const LockFactory = await hre.ethers.getContractFactory("LockFactory");
    const factory = await LockFactory.deploy();
    await factory.waitForDeployment();

    const factoryAddress = await factory.getAddress();
    console.log(`✅ LockFactory deployed to: ${factoryAddress}`);

    // 保存地址到 scripts/config.js
    const configPath = path.resolve(__dirname, "config.js");
    const content = `module.exports = {\n  lockFactoryAddress: "${factoryAddress}"\n};\n`;
    fs.writeFileSync(configPath, content);
    console.log(`💾 Saved to config.js`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
