import {Client, Events} from "discord.js";

export function registerReadyEvent(client: Client): void {
    client.once(Events.ClientReady, (readyClient) => {
        console.log(
            `[Bloom] Conectada como ${readyClient.user.tag}`
        );
    });
}