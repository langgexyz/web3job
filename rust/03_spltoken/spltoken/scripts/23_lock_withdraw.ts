
import * as anchor from "@coral-xyz/anchor";
import {
    getOrCreateAssociatedTokenAccount,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Lock } from "../target/types/lock";
import {config} from "./config"

export async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const connection = provider.connection;
    const wallet = provider.wallet as anchor.Wallet;
    const signer = wallet.payer;
    const program = anchor.workspace.lock as anchor.Program<Lock>;

    // 生成 state PDA
    const [statePda, _stateBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("state"), signer.publicKey.toBuffer()],
        program.programId
    );

    console.log("statePda", statePda.toBase58())
    // 生成 vault PDA
    const [vaultPda, _vaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), signer.publicKey.toBuffer()],
        program.programId
    );
    console.log("vaultPda", vaultPda.toBase58())

    const tx = await program.methods
        .withdraw(new anchor.BN(1_000_000_000))
        .accounts({
            owner:signer.publicKey,
            state:statePda,
            vault:vaultPda,
            systemProgram:anchor.web3.SystemProgram.programId,
        })
        .signers([signer])
        .rpc();

    console.log("✅ withdraw 成功，交易哈希:", tx);
}

main().catch(console.error);
