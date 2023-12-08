module.exports = {
  config: {
    prefix: "$",
    token: process.env["DISCORD_TOKEN"],
    mongourl: process.env["DATABASE_URL"],
    serverId: process.env["TEST_SERVER_ID"],
    botId: process.env["BOT_ID"],
    ownerId: process.env["OWNER_ID"],
  },
  colors: {
    main: "FF8C00",
    error: "FF0000",
    standby: "000000",
    success: "00FF00",
  },
  emoji: {
    play: "▶️",
    stop: "⏹️",
    queue: "📄",
    success: "☑️",
    repeat: "🔁",
    error: "❌",
    success: "✅",
  },
};
