const hre = require("hardhat");
const config = require("./config");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const tokenAddress = config.tokenAddress;
    const lockAddress = config.lockAddress;

    const XYZToken = await hre.ethers.getContractAt("XYZTokenMintable", tokenAddress);
    const Lock = await hre.ethers.getContractAt("Lock", lockAddress);

    const amount = hre.ethers.parseUnits("100", 18);

    // 1. 授权 Lock 合约转账
    const approveTx = await XYZToken.approve(lockAddress, amount);
    await approveTx.wait();
    console.log(`✅ Approved 100 XYZ to Lock`);

    // 2. 存入代币到锁仓合约
    const depositTx = await Lock.deposit(amount);
    await depositTx.wait();
    console.log(`✅ Deposited 100 XYZ to Lock`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
