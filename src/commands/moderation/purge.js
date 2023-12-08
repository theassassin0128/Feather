const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("🗑️ Purge messages of a channel.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The number of messages to delete.")
        .setRequired(true)
        .setMaxValue(100)
        .setMinValue(1)
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Select a Guild Member.")
        .setRequired(false)
    ),
  category: "Moderation",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (interaction, client) => {
    interaction.deferReply({
      ephemeral: true,
    });

    const amount = interaction.options.getInteger("amount");
    const target = interaction.options.getUser("target");

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTitle("TASK COMPLETED")
      .setColor(client.colors.main)
      .setFooter({
        text: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    if (target) {
      var fetchedMessages = await interaction.channel.messages.fetch();
      var messagesToDelete = [];
      var i = 0;

      fetchedMessages.filter((message) => {
        if (message.author.id === target.id && amount > i) {
          messagesToDelete.push(message);
          i++;
        }
      });

      var deletedMessages = await interaction.channel.bulkDelete(
        messagesToDelete,
        true
      );

      interaction.followUp({
        embeds: [
          embed.setDescription(
            `🧹️ Purged \`${deletedMessages.size}\` messages of <@${target.id}>`
          ),
        ],
        ephemeral: true,
      });
    } else {
      var deletedMessages = await interaction.channel.bulkDelete(amount, true);

      interaction.followUp({
        embeds: [
          embed.setDescription(
            `🧹️ Purged \`${deletedMessages.size}\` messages from <#${interaction.channel.id}>`
          ),
        ],
        ephemeral: true,
      });
    }
  },
};
