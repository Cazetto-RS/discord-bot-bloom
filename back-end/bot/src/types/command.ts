import type {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

export interface BloomCommand {
    data: SlashCommandBuilder;

    execute(
        interection: ChatInputCommandInteraction
    ): Promise<void>;
}