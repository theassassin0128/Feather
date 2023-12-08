const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("A simple test command.")
    .setDMPermission(false),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (interaction, client) => {
    interaction.reply({
      content: `TEST COMPLETE.`,
      ephemeral: true,
    });
  },
};
