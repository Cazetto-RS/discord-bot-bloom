import {Client, Events} from "discord.js";
import {execute as executePing} from "../commands/ping.js";

export function registerInteractionEvent(
    client: Client
): void {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        try {
            switch (interaction.commandName) {
                case "ping":
                    await executePing(interaction);
                    break;
            }
        } catch (error) {
            console.error(
                "[Bloom] Erro ao executar comando:",
                error
            );

            const message = {
                content: "Ocorreu um erro ao executar o comando.",
                ephemeral: true,
            };

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(message);
                } else {
                    await interaction.reply(message);
                }
            } catch (responseError) {
                console.error(
                    "[Bloom] Falha ao responder interação:",
                    responseError
                );
            }
        }
    });
}