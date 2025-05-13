const { ethers, upgrades } = require("hardhat");

async function main() {
    const proxyAddress = "0x59b670e9fA9D0A427751Af201D676719a970857b"; // 替换

    const LockV2 = await ethers.getContractFactory("LockV2");
    const upgraded = await upgrades.upgradeProxy(proxyAddress, LockV2);

    console.log("✅ 升级完成，新逻辑合约地址（不可见）：", await upgraded.getAddress());
}

main().catch(console.error);
