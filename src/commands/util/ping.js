const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("🏓️ Replies with API & WS ping.")
    .setDMPermission(true),
  category: "Information",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (interaction, client) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();
    const apiPing = reply.createdTimestamp - interaction.createdTimestamp;
    const webPing = client.ws.ping;

    let emLatency = {
      Green: "🟢",
      Yellow: "🟡",
      Red: "🔴",
    };

    let latancy = new EmbedBuilder()
      .setColor(
        webPing <= 200 ? "00FF00" : webPing <= 400 ? "FFFF00" : "FF0000"
      )
      .setTitle(`Latency And API Ping`)
      .addFields(
        {
          name: "📡 Websocket Latency",
          value: `\`${
            webPing <= 200
              ? emLatency.Green
              : webPing <= 400
              ? emLatency.Yellow
              : emLatency.Red
          }\` \`${webPing}\`ms`,
        },
        {
          name: "🛰 API Latency",
          value: `\`${
            apiPing <= 200
              ? emLatency.Green
              : apiPing <= 400
              ? emLatency.Yellow
              : emLatency.Red
          }\` \`${apiPing}\`ms`,
        }
      );

    interaction.editReply({
      embeds: [latancy],
    });
  },
};
