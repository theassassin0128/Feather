const {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
} = require("discord.js");
const { sendErrors } = require("../../functions/sendErrors.js");

module.exports = {
  name: "interactionCreate",
  once: false,
  rest: false,
  /**
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @returns
   */
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    try {
      const command = await client.commands.get(interaction.commandName);

      if (!command) {
        interaction.reply({
          content: "This command isn't available.",
          ephemeral: true,
        });
        await client.application.commands.delete(interaction.commandName);
        return;
      }

      await command.execute(interaction, client);
    } catch (error) {
      if (interaction.deferred) {
        interaction.editReply({
          content: `An error occured while executing the command.`,
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: `An error occured while executing the command.`,
          ephemeral: true,
        });
      }

      await sendErrors(error, client);
      throw error;
    }
  },
};
