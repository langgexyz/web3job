const hre = require("hardhat");
const {myNFTAddress, nftVaultAddress} = require("./config");

async function main() {
    // user 发起 approve → deposit → withdraw
    const tokenId = 0
    const signers = await hre.ethers.getSigners();
    if (signers.length < 2) {
        throw new Error("At least two signers are required: one for deployer, one for user.");
    }

    const deployer = signers[0];
    const user = signers[signers.length - 1];

    const nftVault = await hre.ethers.getContractAt("NFTVault", nftVaultAddress, user);
    const myNFT = await hre.ethers.getContractAt("MyNFT", myNFTAddress, user);

    const ownerOf = await myNFT.ownerOf(tokenId);
    console.log(`NFT(${tokenId}) owner:`, ownerOf);

    // 方式1：授权单个 token
    // await myNFT.approve(nftVaultAddress, tokenId);

    // 方式2：批量授权
    const isApproved = await myNFT.isApprovedForAll(user.address, nftVaultAddress);
    if (!isApproved) {
        const approvalTx = await myNFT.setApprovalForAll(nftVaultAddress, true);
        await approvalTx.wait();
        console.log("Vault approved to transfer all NFTs.");
    }

    // 存入 vault
    const depositTx = await nftVault.deposit(tokenId);
    console.log("Deposit tx hash:", depositTx.hash);
    await depositTx.wait();
    console.log("Deposit confirmed.");

    // 提出 vault
    const withdrawTx = await nftVault.withdraw(tokenId);
    console.log("Withdraw tx hash:", withdrawTx.hash);
    await withdrawTx.wait();
    console.log("Withdraw confirmed.");
}

main().catch(console.error)