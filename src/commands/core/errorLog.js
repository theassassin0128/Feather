const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const errorlog = require("../../schemas/errorLog.js");
const { colours } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("errorlog")
    .setDescription("Setup the Error logging channel.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((option) =>
      option
        .setName("setup")
        .setDescription("Setup the error log channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Select a channel.")
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((option) =>
      option.setName("toggle").setDescription("Toggle between on/off.")
    )
    .addSubcommand((option) =>
      option.setName("delete").setDescription("Delete's the error log system.")
    )
    .addSubcommand((option) =>
      option
        .setName("info")
        .setDescription("Get information regarding error log system.")
    ),
  test: true,
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (interaction, client) => {
    const doc = await errorlog.findOne({
      Guild: interaction.guild.id,
    });

    switch (interaction.options.getSubcommand()) {
      case "setup":
        {
          const channel =
            interaction.options.getChannel("channel") || interaction.channel;

          const embed = new EmbedBuilder()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTitle("Setup Complete")
            .setDescription(
              `\`\`\`js\nmodule.exports = {\n  server: ${`{\n    name: "${interaction.guild.name}",\n    id: "${interaction.guild.id}"\n  }`},\n  channel: ${`{\n    name: "${channel.name}",\n    id: "${channel.id}"\n  }`},\n  enabled: true\n};\n\`\`\`\n\nFrom today onward all error logs and messages will be send to ${channel}`
            )
            .setThumbnail(interaction.guild.iconURL())
            .setColor(colours.main)
            .setFooter({
              text: client.user.tag,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();

          if (!doc) {
            interaction.options.getChannel("channel") || interaction.channel;
            await errorlog.create({
              Guild: interaction.guild.id,
              Channel: channel.id,
              Enabled: "true",
            });

            return interaction.reply({
              embeds: [embed],
              ephemeral: true,
            });
          } else {
            doc.$set("Channel", `${channel.id}`);
            doc.save();

            return interaction.reply({
              content: `**Updated** errorlog channel - <#${channel.id}>\n\`\`\`js\nChannel: "${channel.id}"\n\`\`\``,
              ephemeral: true,
            });
          }
        }
        break;
      case "toggle":
        {
          if (!doc) {
            return interaction.reply({
              content: "The errorlog  is not setup.",
              ephemeral: true,
            });
          }

          if (doc.Enabled == "true") {
            doc.$set("Enabled", "false");
            doc.save();

            return interaction.reply({
              content: `Toggle **off** the errorlog.`,
              ephemeral: true,
            });
          }
          if (doc.Enabled == "false") {
            doc.$set("Enabled", "true");
            doc.save();

            return interaction.reply({
              content: `Toggle **on** the errorlog.`,
              ephemeral: true,
            });
          }
        }
        break;
      case "delete":
        {
          if (!doc) {
            interaction.reply({
              content: "**Their is no errorlog channel**",
              ephemeral: true,
            });
          } else {
            await errorlog.deleteOne({ Guild: interaction.guild.id });
            interaction.reply({
              content: "**Successfully deleted errorlog system data.**",
              ephemeral: true,
            });
          }
        }
        break;
      case "info":
        {
          const guild = doc ? client.guilds.fetch(doc.Guild) : "";
          const channel = guild
            ? (await guild).channels.fetch(doc.Channel)
            : "";

          const info = new EmbedBuilder()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTitle("ERROR LOG INFO")
            .setDescription(
              `\`\`\`js\nmodule.exports = {\n  server: ${
                guild
                  ? `{\n    name: "${guild.name}",\n    id: "${guild.id}"\n  }`
                  : `"Not Setup"`
              },\n  channel: ${
                channel
                  ? `{\n    name: "${channel.name}",\n    id: "${channel.id}"\n  }`
                  : `"Not Setup"`
              },\n  enabled: ${doc ? `${doc.Enabled}` : "false"}\n};\n\`\`\``
            )
            .setThumbnail(guild ? (await guild).iconURL() : null)
            .setColor(colours.main)
            .setFooter({
              text: client.user.tag,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();

          interaction.reply({
            embeds: [info],
            ephemeral: true,
          });
        }
        break;
    }
  },
};
