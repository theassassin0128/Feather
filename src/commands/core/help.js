const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
} = require("discord.js");
const { loadFiles } = require("../../functions/loadFiles");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List of all available commands"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (interaction, client) => {
    let str = "";
    const commandFiles = await loadFiles("src/commands");

    for (const file of commandFiles) {
      const command = require(file);
      str += `${command.data.name}\nDescription: ${command.data.description} \n`;
    }

    return void interaction.reply({
      content: str,
    });
  },
};
