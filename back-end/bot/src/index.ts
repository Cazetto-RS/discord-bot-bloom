import {Client, GatewayIntentBits} from "discord.js";

import {env} from "./config/env.js";
import { registerReadyEvent } from "./events/ready.js";
import { registerInteractionEvent } from "./events/interaction-create.js";
import { registerGatewayEvents } from "./events/gateway.js";


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

registerReadyEvent(client);
registerInteractionEvent(client);
registerGatewayEvents(client);

async function main(): Promise<void> {
    try {
        console.log("[Bloom] Iniciando bot...");

        await client.login(env.DISCORD_TOKEN);
    } catch (error) {
        console.error(
            "[Bloom] Falha ao conectar ao Discord:",
            error
        );

        process.exitCode = 1;
    }
}

void main();