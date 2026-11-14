import {Events, type Client} from "discord.js";
import {logger} from "../utils/logger.js";

// Monitora o estado da conexão gateway com o Discord, o discord.js continua sendo o responsável pelas conexões, este módulo apenas registra os eventos.

export function registerGatewayEvents(client: Client): void {

    // Uma conexão Gateway ficou pronta
    client.on(Events.ShardReady, (shardId) => {
        logger.info(
            `Gateway ${shardId}: conexão pronta.`
        );
    });

    // O discord.js iniciou uma tentativa de reconexão
    client.on(Events.ShardReconnecting, (shardId) => {
        logger.warn(
        `Gateway ${shardId}: tentando reconectar.`
        );
    });

    // Uma sessão anterior foi retomada
    client.on(
        Events.ShardResume,
        (shardId, replayedEvents) => {
            logger.info(
                `Gateway ${shardId}: sessão retomada.` +
                `Eventos reproduzidos: ${replayedEvents}.`
            );
        }
    );

    // Uma conexão foi encerrada sem nova reconexão automática dessa sessão
    client.on(
        Events.ShardDisconnect,
        (event, shardId) => {
            logger.warn(
                `Gateway ${shardId}: conexão encerrada` +
                `Código: ${event.code}.`
            );
        }
    );

    // Erro de comunicação na conexão Gateway
    client.on(Events.ShardError, (error, shardId) => {
        logger.error(
            `Gateway ${shardId}: erro de conexão`
        );
    });
}