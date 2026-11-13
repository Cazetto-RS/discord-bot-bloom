import type { BloomCommand } from "../types/command.js";
import { pingCommand } from "../commands/ping.js";

// Lista central dos comandos disponíveis no Bot Bloom, cada comando deve implementar a interface BloomCommand

const commands: BloomCommand[] = [
    pingCommand,
];

// Registro de comando, organizado pelo nome

const commandRegistry = new Map<string, BloomCommand>();

for (const command of commands) {
    const name = command.data.name;

    // Impede o registro duplicados de comandos
    if (commandRegistry.has(name)) {
        throw new Error(
            `[Bloom] Comando duplicado: ${name}`
        );
    }

    commandRegistry.set(name, command);
}

// Retorna um comando registrado pelo nome, caso não exista, retornará undefined

export function getCommand(
    name: string
): BloomCommand | undefined {
    return commandRegistry.get(name);
}

// Retorna todos os comandos registrados, será utilizado para enviar os comandos ao Discord

export function getAllCommands(): BloomCommand[] {
    return [...commandRegistry.values()];
}