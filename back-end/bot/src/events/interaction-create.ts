import { Client, Events, MessageFlags } from "discord.js";
import { getCommand } from "../handlers/command.registry.js";
import { Performance } from "node:perf_hooks";
import { logger } from "../utils/logger.js";

export function registerInteractionEvent(
    client: Client
): void {
    client.on(Events.InteractionCreate, async (interaction) => {
        // Ignora as interações que não possuem "/"
        if (!interaction.isChatInputCommand()) return;

        // Procura o comando no registro central
        const command = getCommand(interaction.commandName);

        // Trata comando que não foram encontrados
        if (!command) {
            console.warn(
                `[Bloom] Comando não registrado: ${interaction.commandName}`
            );

            await interaction.reply({
                content: "Este comando não exite ou está indisponível",
                flags: MessageFlags.Ephemeral
            });

            return;
        }

        const commandName = interaction.commandName;
        const userId = interaction.user.id;
        const username = interaction.user.username;
        const guildId = interaction.guildId ?? "DM";

        const startTime = performance.now();

        logger.info(
            `Comando /${commandName} recebido |` +
            `Usuário: ${username} (${userId}) |` +
            `Servidor: ${guildId}`
        );

        try {
            await command.execute(interaction);

            const duration = performance.now() - startTime;

            logger.info(
                `Comando /${commandName} executado em ${duration.toFixed(2)} ms`
            )
        } catch (error) {
            const duration = performance.now() - startTime;

            logger.error(
                `Falha no comando /${commandName} após ${duration.toFixed(2)} ms`
            )

            console.error(
                `[Bloom] Erro no comando ${interaction.commandName}:`,
                error
            );

            try {
                const message = {
                    content: "Ocorreu um erro ao executar este comando",
                    flags: MessageFlags.Ephemeral as const,
                };

                // Seleciona a resposta conforme o estado da intenração
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(message);
                } else {
                    await interaction.reply(message)
                }
            } catch (responseError) {
                console.error(
                    "[Bloom] Não foi possível informar o erro ao usuário:",
                    responseError
                );
            }
        }
    });
}