const hre = require("hardhat")
const fs = require("fs");
const path = require("path");

async function main() {
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy();
    await myNFT.waitForDeployment();

    const myNFTAddress = await myNFT.getAddress()
    console.log(`✅ MyNFT deployed to: ${myNFTAddress}`);

    const NFTVault = await hre.ethers.getContractFactory("NFTVault");
    const nftVault = await NFTVault.deploy(myNFTAddress);
    await nftVault.waitForDeployment();
    // 保存地址到 scripts/config.js
    const config = {
        myNFTAddress:myNFTAddress,
        nftVaultAddress:await nftVault.getAddress(),
    }
    const configPath = path.resolve(__dirname, "config.js");
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};\n`);
    console.log(`💾 Saved to config.js`);

}

main().catch(console.error)