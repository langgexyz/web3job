const { ethers, upgrades } = require("hardhat");

// TODO 验证部署 2 个 Proxy 能否公用同一个 ProxyAdmin
async function main() {
    const Lock = await ethers.getContractFactory("Lock");
    const unlockTime = Math.floor(Date.now() / 1000) + 300;

    const proxy1 = await upgrades.deployProxy(Lock, [unlockTime], {
        initializer:"initialize",
        value: ethers.parseEther("0.01"),
    })

    await proxy1.waitForDeployment();
    const proxy1Address = await proxy1.getAddress();

    const proxy2 = await upgrades.deployProxy(Lock, [unlockTime], {
        initializer:"initialize",
        value: ethers.parseEther("0.01"),
    })
    await proxy2.waitForDeployment();
    const proxy2Address = await proxy2.getAddress();
    const proxy2AdminAddress = await upgrades.erc1967.getAdminAddress(proxy2Address);


    const proxy1AdminAddress = await upgrades.erc1967.getAdminAddress(proxy1Address)

    console.log("proxy2AdminAddress", proxy2AdminAddress)
    console.log("proxy1AdminAddress", proxy1AdminAddress);
}

main().catch(console.error);