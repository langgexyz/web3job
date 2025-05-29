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
    try {
        const state = await program.account.messageAccount.fetch(messageAccount)
        console.log("✅ PDA 数据读取成功:", state);
    } catch (e) {
        console.error("❌ 读取失败:", e);
    }
}

main().catch(console.error)