
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

    // 生成 vault PDA
    const [vaultPda, _vaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), signer.publicKey.toBuffer()],
        program.programId
    );

    console.log("statePda", statePda.toBase58())
    console.log("vaultPda", vaultPda.toBase58())
    if (!await connection.getAccountInfo(vaultPda)) {
        const tx = await program.methods
            .createVault()
            .accounts({
                owner: signer.publicKey,
                vault: vaultPda,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([signer])
            .rpc();

        console.log("Vault created with tx:", tx);
    }

    const tx = await program.methods
        .initialize(new anchor.BN(new Date().getTime()/1000 + 5*60))
        .accounts({
            owner:signer.publicKey,
            state:statePda,
            vault:vaultPda,
            systemProgram:anchor.web3.SystemProgram.programId,
        })
        .signers([signer])
        .rpc();

    console.log("✅ initialize 成功，交易哈希:", tx);
}

main().catch(console.error);
