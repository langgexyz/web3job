import * as anchor from "@coral-xyz/anchor";
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Spltoken } from "../target/types/spltoken";

export async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const connection = provider.connection;
    const wallet = provider.wallet as anchor.Wallet;
    const signer = wallet.payer;
    const program = anchor.workspace.spltoken as anchor.Program<Spltoken>;

    // 创建新的 mint（新的 token 类型）
    const mint = await createMint(
        connection,
        signer,
        signer.publicKey,
        null,
        9
    );
    console.log("✅ 创建的 Mint 地址:", mint.toBase58());

    // 获取接收者的 Associated Token Account（ATA）
    const toATA = await getOrCreateAssociatedTokenAccount(
        connection,
        signer,
        mint,
        signer.publicKey // 自己接收 token
    );

    // 构造 Anchor 调用参数
    const amount = new anchor.BN(1000_000_000_000); // 即 1 token，如果 decimals=9
    const tx = await program.methods
        .mintTokens(amount)
        .accounts({
            mint,
            to: toATA.address,
            mintAuthority: signer.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([signer])
        .rpc();

    console.log("✅ Mint 成功，交易哈希:", tx);
    console.log("📦 TokenAccount 地址:", toATA.address.toBase58());
}

main().catch((err) => {
    console.error("❌ 发生错误:", err);
});
