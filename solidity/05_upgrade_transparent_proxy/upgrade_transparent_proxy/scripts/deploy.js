const { ethers, upgrades } = require("hardhat");
const path = require("path");
const fs = require("fs");

/**
 1. 如何获取 implementation 地址; 不通过 implementation 能不能直接调用？
 2. 验证管理员和非管理员调用业务；
 3. 验证合约升级
 */
async function main() {
    const Lock = await ethers.getContractFactory("Lock");
    const unlockTime = Math.floor(Date.now() / 1000) + 300;

    const proxy = await upgrades.deployProxy(Lock, [unlockTime], {
        initializer:"initialize",
        value: ethers.parseEther("0.01"),
    })

    await proxy.waitForDeployment();
    const proxyAddress = await proxy.getAddress();

    const adminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress)
    const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress)
    const config = {
        proxyAddress:proxyAddress,
        implementationAddress:implementationAddress,
        adminAddress:adminAddress,
    }
    const configPath = path.resolve(__dirname, "config.js");
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};\n`);
    console.log(`💾 Saved to config.js`);
}

main().catch(console.error);