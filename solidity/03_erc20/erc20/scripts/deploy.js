const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    // 1. 部署 XYZTokenMintable
    const XYZToken = await hre.ethers.getContractFactory("XYZTokenMintable");
    const initialSupply = hre.ethers.parseUnits("1000000", 18);
    const token = await XYZToken.deploy(initialSupply);
    await token.waitForDeployment();
    const tokenAddress = token.target;
    console.log("XYZToken deployed to:", tokenAddress);

    // 2. 设置解锁时间为当前时间 + 5 分钟
    const now = Math.floor(Date.now() / 1000);
    const unlockTime = now + 300; // 300 秒 = 5 分钟

    // 3. 部署 Lock
    const Lock = await hre.ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(tokenAddress, unlockTime);
    await lock.waitForDeployment();
    const lockAddress = lock.target;
    console.log("Lock deployed to:", lockAddress);

    // 4. 保存到 config.js
    const configPath = path.join(__dirname, "config.js");
    const configContent = `module.exports = {\n  tokenAddress: "${tokenAddress}",\n  lockAddress: "${lockAddress}"\n};\n`;

    fs.writeFileSync(configPath, configContent);
    console.log("Addresses saved to config.js");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
