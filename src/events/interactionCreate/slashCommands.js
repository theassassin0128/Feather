const {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
} = require("discord.js");
const { TEST_SERVER_ID } = process.env;
const { devs } = require("../../config.json");
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

      if (command.testServerOnly) {
        if (!(interaction.guild.id === TEST_SERVER_ID)) {
          interaction.reply({
            content: "This command is unavailable in your server.",
            ephemeral: true,
          });
          return;
        }
      }

      if (command.permissionsRequired?.length) {
        for (const permission of command.permissionsRequired) {
          if (!interaction.member.permissions.has(permission)) {
            interaction.reply({
              content: `You need \`${permission}\` permission to use this command.`,
              ephemeral: true,
            });
            return;
          }
        }
      }
      if (command.botPermissions?.length) {
        const bot = interaction.guild.members.me;

        for (const permission of command.botPermissions) {
          if (!bot.permissions.has(permission)) {
            interaction.reply({
              content: `I need \`${permission}\` permission to execute this command.`,
              ephemeral: true,
            });
            return;
          }
        }
      }

      await command.execute(interaction, client);
    } catch (error) {
      interaction.reply({
        content: `An error occured while executing the command.`,
        ephemeral: true,
      });
      await sendErrors(interaction, error, client);
      return console.error(error);
    }
  },
};
