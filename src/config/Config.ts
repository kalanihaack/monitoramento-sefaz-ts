export const Config = {
    //inserir o webhook do discord abaixo
    discordWebhook: process.env.DISCORD_WEBHOOK || "DISCORD_WEBHOOK",
    checkIntervalMs: 60000,
    minErrorDurationMinutes: 5,
    ufs: [
        "ac", "al", "am", "ap", "ba", "ce", "df", "es", "go", "ma",
        "mg", "ms", "mt", "pa", "pb", "pe", "pi", "pr", "rj", "rn",
        "ro", "rr", "rs", "sc", "se", "sp", "to"
    ]
};
