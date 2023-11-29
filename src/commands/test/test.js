const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} = require("discord.js");
const { colours } = require("../../config.json");
const { sendErrors } = require("../../functions/sendErrors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("A simple test command.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option.setName("user").setDescription("Select an user.").setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (interaction, client) => {
    const infractions = client.mongodb.db("test").collection("infractions");
    if (!infractions) client.mongodb.db("test").createCollection("infractions");

    const user = interaction.options.getUser("user");

    const documents = await infractions.findOne({
      Guild: interaction.guild.id,
      User: user.id,
    });
    console.log(documents);
    interaction.reply({
      content: `TEST COMPLETE.`,
      ephemeral: true,
    });
  },
};
