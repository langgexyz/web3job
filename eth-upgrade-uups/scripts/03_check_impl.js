const { upgrades } = require("hardhat");

async function main() {
    const proxyAddress = "0x4A679253410272dd5232B3Ff7cF5dbB88f295319";

    const impl = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("🧠 当前实现合约地址：", impl);
}

main().catch(console.error);
