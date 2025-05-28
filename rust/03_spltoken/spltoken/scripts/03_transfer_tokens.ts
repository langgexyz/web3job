import * as anchor from "@coral-xyz/anchor";
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Spltoken } from "../target/types/spltoken";
import {config} from "./config"

export async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const connection = provider.connection;
    const wallet = provider.wallet as anchor.Wallet;
    const signer = wallet.payer;
    const program = anchor.workspace.spltoken as anchor.Program<Spltoken>;

    const mint = new anchor.web3.PublicKey(config.mintAddress);

    const fromATA = await getOrCreateAssociatedTokenAccount(
        connection,
        signer,
        mint,
        signer.publicKey
    )
    // 获取接收者的 Associated Token Account（ATA）
    const toATA = await getOrCreateAssociatedTokenAccount(
        connection,
        signer,
        mint,
        new anchor.web3.PublicKey("Bf9YiBJYkbigrQmX9JT5BBk9QRmZbqvzwAn2BzYeFWNA") // TODO 修改为你自己的钱包地址
    );

    // 构造 Anchor 调用参数
    const amount = new anchor.BN(50_000_000_000); // 即 1 token，如果 decimals=9
    const tx = await program.methods
        .transferTokens(amount)
        .accounts({
            from:fromATA.address,
            to: toATA.address,
            authority: signer.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([signer])
        .rpc();

    console.log("✅ Transfer 成功，交易哈希:", tx);
    console.log("✅ TokenAccount 地址:", toATA.address.toBase58());
}

main().catch(console.error);
