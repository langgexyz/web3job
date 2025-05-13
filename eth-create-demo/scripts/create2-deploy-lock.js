const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    // 👇 替换为你上一步部署的工厂地址
    const factoryAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508";
    const factory = await ethers.getContractAt("CREATE2Deployer", factoryAddress);

    // 构造 Lock 合约初始化参数
    const unlockTime = Math.floor(Date.now() / 1000) + 300;
    const Lock = await ethers.getContractFactory("Lock");
    const encodedParams = Lock.interface.encodeDeploy([unlockTime]);
    const bytecode = ethers.concat([Lock.bytecode, encodedParams]);

    // 构造 salt 和预测地址
    const salt = ethers.keccak256(ethers.toUtf8Bytes("zero-lock"));
    const bytecodeHash = ethers.keccak256(bytecode);
    const predicted = await factory.computeAddress(salt, bytecodeHash);

    console.log("📍 预计 Lock 地址:", predicted);

    // 执行 CREATE2 部署
    const tx = await factory.deploy(bytecode, salt, {
        value: ethers.parseEther("0.01"),
    });
    await tx.wait();

    console.log("🚀 Lock 合约已部署至:", predicted);
}

main().catch(console.error);
