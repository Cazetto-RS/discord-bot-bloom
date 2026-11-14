type LogLevel = "INFO" | "WARN" | "ERROR";

function log(
    level: LogLevel,
    message: string,
    error?: unknown
): void {
    const timestamp = new Date().toISOString();

    const prefix = `[${timestamp}] [Bloom] [${level}]`;

    switch (level) {
        case "INFO":
            console.info(prefix, message);
            break;

        case "WARN":
            console.warn(prefix, message);
            break;

        case "ERROR":
            console.error(prefix, message);

        if (error !== undefined) {
            console.error(error);
        }
        break;
    }
}

export const logger = {
    info: (message: string): void =>
        log("INFO", message),

    warn: (message: string): void =>
        log("WARN", message),

    error: (message: string, error?: unknown): void =>
        log("ERROR", message, error),
};