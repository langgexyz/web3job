const hre = require("hardhat");

async function main() {
    const LockFactory = await hre.ethers.getContractFactory("LockFactory");
    const factory = await LockFactory.deploy();
    await factory.waitForDeployment();

    console.log(`✅ LockFactory deployed to: ${await factory.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
