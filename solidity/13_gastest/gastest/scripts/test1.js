const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const GasTest = await hre.ethers.getContractFactory("GasTest", deployer);
    const contract = await GasTest.deploy();
    await contract.waitForDeployment();

    console.log("Deployed GasTest to:", contract.target);

    // 构造一个大一点的数组：100个元素
    const arr = Array(100).fill(123);

    // 1. test1_public_memory
    const tx1 = await contract.test1_public_memory(arr);
    const receipt1 = await tx1.wait();
    console.log("Gas used: test1_public_memory      :", receipt1.gasUsed.toString());

    // 2. test1_external_calldata
    const tx2 = await contract.test1_external_calldata(arr);
    const receipt2 = await tx2.wait();
    console.log("Gas used: test1_external_calldata  :", receipt2.gasUsed.toString());

    // 3. test1_public_calldata
    const tx3 = await contract.test1_public_calldata(arr);
    const receipt3 = await tx3.wait();
    console.log("Gas used: test1_public_calldata    :", receipt3.gasUsed.toString());

    // 4. test1_public_memory_external_calldata
    const tx4 = await contract.test1_public_memory_external_calldata(arr);
    const receipt4 = await tx4.wait();
    console.log("Gas used: test1_public_memory_external_calldata    :", receipt4.gasUsed.toString());
}

main().catch(console.error);
