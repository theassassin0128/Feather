const {
  SlashCommandBuilder,
  EmbedBuilder,
  version,
  ChatInputCommandInteraction,
} = require("discord.js");
const pkg = require("../../../package.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Replies with current stats of the bot."),
  category: "Utility",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  execute: async (interaction, client) => {
    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;

    let ping = client.ws.ping;

    let colour = {
      green: "🟢",
      yellow: "🟡",
      red: "🔴",
    };

    const stats = new EmbedBuilder()
      .setColor(client.colors.main)
      .setTitle("__GENERAL INFO__")
      .setDescription(
        [
          `**Name :** ${client.user.username}`,
          `**Tag :** ${client.user.tag}`,
          `**Version :** ${pkg.version}`,
          `**Website :** Coming soon.`,
        ].join("\n")
      )
      .setThumbnail(client.user.avatarURL({ size: 4096 }))
      .addFields(
        {
          name: "__BOT STATUS__",
          value: [
            `**Status** :  \`🟢\` Online`,
            `**Ping** : \`${
              ping <= 200
                ? colour.green
                : ping <= 400
                ? colour.yellow
                : colour.red
            }\` ${ping}ms`,
            `**Uptime** :\n\`\`\`\n${days}Days, ${hours}Hours, ${minutes}Minutes, ${seconds}Seconds\n\`\`\``,
          ].join("\n"),
        },
        {
          name: "__LANGUAGE & LIBRARY INFO__",
          value: [
            `**Name :** [nodejs](https://nodejs.org/en/) | ${process.version}`,
            `**Library :** [discord.js](https://discord.js.org/#/) | ${version}`,
          ].join("\n"),
        },
        {
          name: "__GITHUB REPOSITORY__",
          value: [
            `**Name :** [Feather](https://github.com/theassassin0128/Feather#README.md)`,
            `**Owner :** [theassassin0128](https://github.com/theassassin0128)`,
          ].join("\n"),
        }
      );

    interaction.reply({
      embeds: [stats],
    });
  },
};
