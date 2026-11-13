import {REST, Routes} from "discord.js";

import {env} from "./config/env.js";
import {getAllCommands} from "./handlers/command.registry.js";

const commands = getAllCommands().map(
    (command) => command.data.toJSON()
);

const rest = new REST({version: "10"}).setToken(
    env.DISCORD_TOKEN
);

async function depolyCommands(): Promise<void> {
    try {
        console.log(`[Bloom] Registrando ${commands.length} comandos...`);

        await rest.put(
            Routes.applicationGuildCommands(
                env.DISCORD_CLIENT_ID,
                env.DISCORD_GUILD_ID
            ),
            {body: commands}
        );

        console.log(
            "[Bloom] Comandos registrados com sucesso!"
        );
    } catch (error) {
        console.error(
            "[Bloom] Erro ao registrar comandos:",
            error
        );

        process.exitCode = 1;
    }
}

void depolyCommands();