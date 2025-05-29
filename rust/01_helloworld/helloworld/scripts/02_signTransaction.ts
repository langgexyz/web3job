import * as anchor from "@coral-xyz/anchor";
import {Helloworld} from "../target/types/helloworld";
import {Program} from "@coral-xyz/anchor";

export async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider)

    const connection = provider.connection
    const signer = anchor.Wallet.local().payer;
    const program = anchor.workspace.helloworld as Program<Helloworld>

    const [messageAccount, _bump] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("message"), signer.publicKey.toBuffer()], program.programId)
    const ix = await program.methods.setMessage("Hello, Solana!!!")
        .accounts({
            messageAccount:messageAccount,
        })
        .instruction()

    // Step 1: 获取 blockhash
    // getLatestBlockhash 就是 blockhash?
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    console.log("blockhash", blockhash);
    // TODO 为什么 solana 没有像 EVM 一样的 nonce？ recentBlockhash 的作用是什么？
    const tx = new anchor.web3.Transaction({
        recentBlockhash:blockhash,
        feePayer: signer.publicKey,
    }).add(ix);

    tx.sign(signer);

    const serialized = tx.serialize();
    const rawTx = serialized.toString("base64");

    console.log("Signed Base64 Transaction:");
    console.log(rawTx);

    // TODO 这段代码是为了验证前端 ts 发送签名
    // // Step 4: 发送
    // const txid = await connection.sendRawTransaction(serialized);
    // console.log("✅ Sent! TxID:", txid);
    //
    // // Optional: 确认
    // const confirmation = await connection.confirmTransaction({ signature: txid, blockhash, lastValidBlockHeight });
    // console.log("Transaction confirmation status:", confirmation);

    // TODO 验证同样的内容，签名是一样的
    (() => {
        const tx = new anchor.web3.Transaction({
            recentBlockhash:blockhash,
            feePayer: signer.publicKey,
        }).add(ix);

        tx.sign(signer);

        const serialized = tx.serialize();
        const rawTx = serialized.toString("base64");

        console.log("Signed Base64 Transaction:");
        console.log(rawTx);
    })()
}

main().catch(console.error)