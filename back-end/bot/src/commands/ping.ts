import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Verifique se o Bloom está funcionando");

export async function execute(
    interaction: ChatInputCommandInteraction
): Promise<void> {
    await interaction.reply({
        content: "Pong! Bloom está online."
    });
}