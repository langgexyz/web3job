const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const XYZToken = await hre.ethers.getContractFactory("XYZTokenMintable"); // 或 XYZTokenFixed
    const token = await XYZToken.deploy(hre.ethers.parseUnits("1000000", 18));

    await token.waitForDeployment();

    const address = token.target;
    console.log("Token deployed to:", address);

    // 保存地址到 config.js
    const configPath = path.join(__dirname, "config.js");
    const configContent = `module.exports = {\n  tokenAddress: "${address}"\n};\n`;

    fs.writeFileSync(configPath, configContent);
    console.log("Token address saved to config.js");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
