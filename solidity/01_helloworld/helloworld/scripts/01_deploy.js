const fs = require("fs");
const path = require("path");

async function main() {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const hello = await HelloWorld.deploy("Hello from deployment script!");

    const address = await hello.getAddress();

    console.log("HelloWorld deployed to:", address);

    const config = {
        address: address,
    };

    const configPath = path.resolve(__dirname, "config.js");
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};\n`);
    console.log(`💾 Saved to config.js`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});