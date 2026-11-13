import {SlashCommandBuilder} from "discord.js";

import type { BloomCommand } from "../types/command.js";

export const pingCommand = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Verificnado sem a Bloom está funcionando"),

    async execute(interection) {
        await interection.reply({
            content: "Pong! Bloom está online."
        });
    },
} satisfies BloomCommand;