const hre = require("hardhat");
const {myNFTAddress, nftVaultAddress} = require("./config");

async function main() {
    const tokenId = 0
    const signers = await hre.ethers.getSigners();

    const nftVault = await hre.ethers.getContractAt("NFTVault", nftVaultAddress);
    const myNFT = await hre.ethers.getContractAt("MyNFT", myNFTAddress, signers[0]);

    // 方式1：授权单个 token
    // await myNFT.approve(nftVaultAddress, tokenId);

    // 方式2：批量授权
    const isApproved = await myNFT.isApprovedForAll(signers[0].address, nftVaultAddress);
    if (!isApproved) {
        const approvalTx = await myNFT.setApprovalForAll(nftVaultAddress, true);
        await approvalTx.wait();
        console.log("Vault approved to transfer all NFTs.");
    }

    const tx = await nftVault.deposit(tokenId)
    console.log("Deposit transaction sent. Tx hash:", tx.hash);

    await tx.wait();
    console.log("Deposit transaction confirmed.");

    const tx2 = await nftVault.withdraw(tokenId);
    console.log("Withdraw transaction sent. Tx hash:", tx2.hash);

    await tx2.wait();
    console.log("Withdraw transaction confirmed.");
}

main().catch(console.error)