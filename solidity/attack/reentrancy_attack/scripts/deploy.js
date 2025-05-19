const { ethers } = require("hardhat");

async function main() {
    // 部署 Victim 合约
    const Victim = await ethers.getContractFactory("Victim");
    const victim = await Victim.deploy();
    await victim.waitForDeployment();
    console.log("Victim contract deployed to:", await victim.getAddress());

    // 存款 10 ETH 到 Victim 合约
    const tx = await victim.deposit({ value: ethers.parseEther("10") });
    await tx.wait();
    console.log("Deposit of 10 ETH successful!");

    // 检查 Victim 合约存款后的余额
    let victimBalance = await ethers.provider.getBalance(await victim.getAddress());
    console.log("Victim contract balance after deposit:", ethers.formatEther(victimBalance));

    // 部署 Attacker 合约
    const Attacker = await ethers.getContractFactory("Attacker");
    const attacker = await Attacker.deploy(await victim.getAddress());
    await attacker.waitForDeployment();
    console.log("Attacker contract deployed to:", await attacker.getAddress());

    // 检查 Attacker 合约的初始余额
    let attackerBalanceBefore = await ethers.provider.getBalance(await attacker.getAddress());
    console.log("Attacker contract balance before attack:", ethers.formatEther(attackerBalanceBefore));

    // 攻击 Victim 合约
    const tx2 = await attacker.attack({ value: ethers.parseEther("20") });
    await tx2.wait();
    console.log("Attack successful!");

    // 检查 Attacker 合约攻击后的余额
    let attackerBalanceAfter = await ethers.provider.getBalance(await attacker.getAddress());
    console.log("Attacker contract balance after attack:", ethers.formatEther(attackerBalanceAfter));

    // 检查 Victim 合约攻击后的余额
    victimBalance = await ethers.provider.getBalance(await victim.getAddress());
    console.log("Victim contract balance after attack:", ethers.formatEther(victimBalance));
}

main().catch(console.error)