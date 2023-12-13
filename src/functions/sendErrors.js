const { Client, EmbedBuilder } = require("discord.js");

/**
 *
 * @param {Client} client
 */
async function sendErrors(error, client) {
  try {
    const errorlog = require("../schemas/errorlog.js");
    if (!errorlog) return;

    const doc = await errorlog.findOne({ Enabled: "true" });
    if (!doc) return;

    const guild = await client.guilds.fetch(doc.Guild);
    if (!guild) return;

    const channel = await guild.channels.fetch(doc.Channel);
    if (!channel) return;

    const errorEmbed = new EmbedBuilder()
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTitle("An Error Occoured")
      .setDescription(`\`\`\`${error}\`\`\``)
      .setColor(client.colors.error)
      .setTimestamp();

    return channel.send({ embeds: [errorEmbed] });
  } catch (error) {
    throw error;
  }
}

module.exports = { sendErrors };
