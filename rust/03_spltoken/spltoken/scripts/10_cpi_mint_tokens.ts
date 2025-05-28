
import * as anchor from "@coral-xyz/anchor";
import {
    getOrCreateAssociatedTokenAccount,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Spltokencpi } from "../target/types/spltokencpi";
import {config} from "./config"

export async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const connection = provider.connection;
    const wallet = provider.wallet as anchor.Wallet;
    const signer = wallet.payer;
    const program = anchor.workspace.spltokencpi as anchor.Program<Spltokencpi>;

    const mint = new anchor.web3.PublicKey(config.mintAddress);

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
            // TODO 思考如何不手写这个地址，否则spltoken地址变化了，这儿还需要手动同步修改？
            spltokenProgram:new anchor.web3.PublicKey("9q76qB4ieWmZzQ3tbgqtKNtLScBj4QD3w5942GEBsjqz"),
            ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        })
        .signers([signer])
        .rpc();

    console.log("✅ Mint 成功，交易哈希:", tx);
    console.log("✅ TokenAccount 地址:", toATA.address.toBase58());
}

main().catch(console.error);
