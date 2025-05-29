const {ethers} = require("hardhat");
const fs = require("fs");
const path = require("path");
const config = require("./config")

async function main() {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const contract = new ethers.Contract(config.address, HelloWorld.interface, (await ethers.getSigners())[0]);

    const tx = await contract.setMessage("hello solidity!!!");

    const receipt = await tx.wait();
    console.log("🎉 setMessage：", receipt.hash);

    // TODO 多个合约触发了同一个名字的事件，如何解析呢？
    const iface = new ethers.utils.Interface(HelloWorld.interface.fragments);

    for (const log of receipt.logs) {
        try {
            const parsed = iface.parseLog(log);
            console.log(`📢 事件: ${parsed.name}`);
            console.log(`👤 sender: ${parsed.args.sender}`);
            console.log(`✏️ old: ${parsed.args.oldMessage}`);
            console.log(`🆕 new: ${parsed.args.newMessage}`);
        } catch (err) {
            console.error("parseLog err", err);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});