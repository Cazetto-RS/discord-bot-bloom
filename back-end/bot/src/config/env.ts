import {config} from "dotenv";
import {fileURLToPath} from "node:url"

const envPath = fileURLToPath (
    new URL("../../../../.env", import.meta.url)
);

config({path: envPath});

function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value?.trim()) {
        throw new Error(
            `Variável de mbiente obrigatória não encontrada: ${name}`
        );
    }

    return value;
}

export const env = {
    DISCORD_TOKEN: requireEnv("DISCORD_TOKEN"),
    DISCORD_CLIENT_ID: requireEnv("DISCORD_CLIENT_ID"),
    DISCORD_GUILD_ID: requireEnv("DISCORD_GUILD_ID")
}