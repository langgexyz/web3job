import * as anchor from "@coral-xyz/anchor";
import {
    createMint,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import path from "path";
import fs from "fs";

export async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const connection = provider.connection;
    const wallet = provider.wallet as anchor.Wallet;
    const signer = wallet.payer;

    const mint = await createMint(
        connection,
        signer,
        signer.publicKey,
        null,
        9
    );
    console.log("创建的 Mint 地址:", mint.toBase58());

    const config = {
        mintAddress:mint.toBase58(),
    }

    const configContent = `export const config = ${JSON.stringify(config, null, 2)} as const;\n`;

    const configPath = path.resolve(__dirname, "config.ts");
    fs.writeFileSync(configPath, configContent);

    console.log(`💾 Saved to config.ts`);
}

main().catch(console.error)