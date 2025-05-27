const hre = require("hardhat");

async function main() {
    const [user] = await hre.ethers.getSigners();
    const Factory = await hre.ethers.getContractFactory("OutOfGasTest");
    const contract = await Factory.deploy();
    await contract.waitForDeployment();

    console.log("Contract deployed to:", contract.target);

    // 测试函数封装
    async function test(name, fn) {
        try {
            await fn();
            console.log(`✅ ${name}: Success`);
        } catch (err) {
            const msg = err.message || err.toString();
            if (msg.includes("out of gas") || msg.includes("exceeded")) {
                console.log(`💥 ${name}: Out of gas`);
            } else {
                console.log(`⚠️ ${name}: Failed - ${msg}`);
            }
        }
    }

    // 各测试场景
    await test("Case 1: loopForever", async () => {
        await contract.loopForever({ gasLimit: 10_000_000 });
    });

    await test("Case 2: writeMany(10000)", async () => {
        await contract.writeMany(10000, { gasLimit: 30_000_000 });
    });

    await test("Case 3: pushMany(10000)", async () => {
        await contract.pushMany(10000, { gasLimit: 30_000_000 });
    });

    await test("Case 4: emitMany(10000)", async () => {
        await contract.emitMany(10000, { gasLimit: 30_000_000 });
    });

    await test("Case 5: writeMap(10000)", async () => {
        await contract.writeMap(10000, { gasLimit: 30_000_000 });
    });

    await test("Case 6: createMany(100)", async () => {
        await contract.createMany(100, { gasLimit: 30_000_000 });
    });

    await test("Case 7: send to fallback()", async () => {
        await user.sendTransaction({
            to: contract.target,
            value: hre.ethers.parseEther("0.01"),
            gasLimit: 100_000,
        });
    });

    await test("Case 8: recursive(900)", async () => {
        await contract.recursive(900, { gasLimit: 10_000_000 });
    });

    await test("Case 9: transferMany(to, 1000)", async () => {
        await contract.transferMany(user.address, 1000, {
            value: hre.ethers.parseEther("1"),
            gasLimit: 30_000_000,
        });
    });
}

main().catch(console.error);
