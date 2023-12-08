const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a member from the server.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) =>
      option
        .setName("target")
        .setDescription("The id of the member.")
        .setRequired(true)
    ),
  category: "Moderation",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (interaction, client) => {
    await interaction.deferReply();

    const { options, guild } = interaction;
    const target = options.getString("target");

    try {
      const user = await guild.members.unban(target);
      return interaction.editReply({
        content: `Successfully unbanned **${user.username}**.`,
      });
    } catch (error) {
      interaction.editReply({
        content: `There was an error while executing the command. ${error}`,
      });
    }
  },
};
