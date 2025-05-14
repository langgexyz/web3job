const { ethers, upgrades } = require("hardhat");

async function main() {
    const proxyAddress = "0x4A679253410272dd5232B3Ff7cF5dbB88f295319";

    const LockV2 = await ethers.getContractFactory("LockV2");
    const upgraded = await upgrades.upgradeProxy(proxyAddress, LockV2);

    console.log("✅ 升级成功，Proxy 地址仍为：", await upgraded.getAddress());
}

main().catch(console.error);
