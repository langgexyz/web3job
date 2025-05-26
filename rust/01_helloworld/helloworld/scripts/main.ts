import * as anchor from "@coral-xyz/anchor";
import {SystemProgram } from "@solana/web3.js";
import {Helloworld} from "../target/types/helloworld";
import {Program} from "@coral-xyz/anchor";

export async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider)

    const connection = provider.connection
    const signer = anchor.Wallet.local().payer;
    const program = anchor.workspace.helloworld as Program<Helloworld>

    const [messageAccount, _bump] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("message"), signer.publicKey.toBuffer()], program.programId)
    const txId = await program.methods.initialize("Hello, Solana!")
        .accounts({
            messageAccount:messageAccount,
            signer:signer,
            systemProgram:SystemProgram.programId,
        })
        .rpc();
    console.log("Transaction submitted:", txId);

    const latestBlockhash = await connection.getLatestBlockhash();
    const confirmation = await connection.confirmTransaction({
        signature: txId,
        ...latestBlockhash,
    }, "confirmed");

    console.log("Transaction confirmation status:", confirmation);
}

main().catch(console.error)