import * as anchor from "@coral-xyz/anchor";
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import {SYSVAR_INSTRUCTIONS_PUBKEY} from "@solana/web3.js";

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

    // 获取接收者的 Associated Token Account（ATA）
    const toATA = await getOrCreateAssociatedTokenAccount(
        connection,
        signer,
        mint,
        signer.publicKey
    );

    const amount = new anchor.BN(1000_000_000_000);
    const tx = await program.methods
        .mintTokensV2(amount)
        .accounts({
            to:toATA.address,
            mint,
            recipient: signer.publicKey,
            mintAuthority: signer.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram:ASSOCIATED_TOKEN_PROGRAM_ID,
            ixSysvar:anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        })
        .signers([signer])
        .rpc();

    console.log("✅ Mint 成功，交易哈希:", tx);
    console.log("✅ TokenAccount 地址:", signer.publicKey.toBase58());
}

main().catch(console.error);
