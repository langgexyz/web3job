const {ethers, upgrades} = require("hardhat")
const path = require("path");
const fs = require("fs");

async function main() {
    // 1. 获取逻辑合约
    const Lock = await ethers.getContractFactory("Lock");

    // 2. 部署 Beacon
    const beacon = await upgrades.deployBeacon(Lock, { initializer: false });
    const beaconAddress = await beacon.getAddress();
    console.log("🔗 Beacon address:", beaconAddress);

    // 3. 部署第一个 BeaconProxy 实例（可部署多个）
    const unlockTime = Math.floor(Date.now() / 1000) + 3600;
    const proxy = await upgrades.deployBeaconProxy(beacon, Lock, [unlockTime], {
        initializer: "initialize",
        value: ethers.parseEther("0.01"),
    });

    console.log("📦 Proxy address:", await proxy.getAddress());

    await proxy.waitForDeployment();

    const proxyAddress = await proxy.getAddress();

    const implementationAddress = await upgrades.beacon.getImplementationAddress(beaconAddress)
    const config = {
        beaconAddress:beaconAddress,
        proxyAddress:proxyAddress,
        implementationAddress:implementationAddress,
    }
    const configPath = path.resolve(__dirname, "config.js");
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};\n`);
    console.log(`💾 Saved to config.js`);
}

main().catch(console.error)