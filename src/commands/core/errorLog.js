const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const { MongoClient } = require("mongodb");
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
      option.setName("delete").setDescription("Delete's the error-log system.")
    ),
  test: true,
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (interaction, client) => {
    const errorlog = client.mongodb.db("test").collection("errorlog");
    if (!errorlog) client.mongodb.db("test").createCollection("errorlog");

    const doc = await errorlog.findOne({ Guild: interaction.guild.id });

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
            .setDescription(
              `**__Setup Complete__**\n\nGuild : **${interaction.guild.name}** | ${interaction.guild.id}\nChannel : <#${channel.id}> | ${channel.id}\nEnabled : **True**`
            )
            .setColor(colours.main)
            .setFooter({
              text: interaction.guild.name,
              iconURL: interaction.guild.iconURL(),
            })
            .setTimestamp();

          if (!doc) {
            await errorlog.insertOne({
              Guild: interaction.guild.id,
              Channel: channel.id,
              Enabled: "true",
            });

            interaction.reply({
              embeds: [embed],
              ephemeral: true,
            });
          } else {
            errorlog.updateOne(
              { _id: doc._id },
              { $set: { Channel: channel.id } }
            );

            interaction.reply({
              content: `**Changed the channel**\n\nChannel : <#${channel.id}> | ${channel.id}`,
              ephemeral: true,
            });
          }
        }
        break;
      case "toggle":
        {
          if (!doc) {
            return interaction.reply({
              content: "errorlog channel is not setup.",
              ephemeral: true,
            });
          }

          const toggle = await errorlog.distinct("Enabled", { _id: doc._id });

          if (toggle == "true") {
            errorlog.updateOne(
              { _id: doc._id },
              { $set: { Enabled: "false" } }
            );

            interaction.reply({
              content: `Toggle **off** the errorlog.`,
              ephemeral: true,
            });
          }
          if (toggle == "false") {
            errorlog.updateOne({ _id: doc._id }, { $set: { Enabled: "true" } });
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
            await errorlog.deleteOne({ _id: doc._id });
            interaction.reply({
              content: "**Successfully deleted errorlog data.**",
              ephemeral: true,
            });
          }
        }
        break;
    }
  },
};
