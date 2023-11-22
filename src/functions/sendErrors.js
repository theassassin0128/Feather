const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { TEST_SERVER_ID } = process.env;
const { colours } = require("../config.json");
const errorlog = require("../schemas/errorlog.js");

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @param {Client} client
 */
async function sendErrors(interaction, client, error) {
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
    .setTitle("ERROR LOG")
    .setDescription(
      `An error occoured while executing \ncommand: **${interaction.commandName}** \non channel: **${interaction.channel.name}** \nin server: **${interaction.guild.name}**.\n\nerror log: \`\`\`js\n${error}\n\`\`\``
    )
    .setColor(colours.error)
    .setFooter({
      text: interaction.guild.name,
      iconURL: interaction.guild.iconURL(),
    })
    .setTimestamp();

  return channel.send({ embeds: [errorEmbed] });
}

module.exports = { sendErrors };
