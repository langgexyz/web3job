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

    const fromPublic = new anchor.web3.PublicKey(signer.publicKey.toBase58())
    const fromATA = await getOrCreateAssociatedTokenAccount(
        connection,
        signer,
        mint,
        fromPublic
    );

    // 构造 Anchor 调用参数
    const amount = new anchor.BN(10_000_000_000);
    const tx = await program.methods
        .burnTokens(amount)
        .accounts({
            mint,
            from: fromATA.address,
            authority: fromPublic,
            tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([signer])
        .rpc();

    console.log("✅ Burn 成功，交易哈希:", tx);
    console.log("✅ TokenAccount 地址:", fromATA.address.toBase58());
}

main().catch(console.error);
