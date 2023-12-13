const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  ChatInputCommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Get a list of server roles and member counts.")
    .setDMPermission(false),
  category: "Utility",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (interaction, client) => {
    await interaction.deferReply();

    const r = interaction.guild.roles.cache.sort(
      (a, b) => b.position - a.position
    );

    if (r.size > 100)
      return interaction.reply({
        content: `Too many roles to display. About [${r.size - 1}] roles.`,
        ephemeral: true,
      });

    const embed = new EmbedBuilder()
      .setTitle(interaction.guild.name)
      .setDescription(
        `Hi! **<@${interaction.user.id}>**,\n\n**/Roles** command is an special kind of command that sort and shows you full list roles in a server.`
      )
      .setColor(client.colors.main)
      .setThumbnail(interaction.guild.iconURL())
      .setTimestamp()
      .setFooter({
        text: `Requested by: ${interaction.member.user.username}`,
        iconURL: interaction.member.user.displayAvatarURL(),
      });

    let button1 = new ButtonBuilder()
      .setCustomId("show")
      .setLabel("Show")
      .setStyle(ButtonStyle.Secondary);

    let button2 = new ButtonBuilder()
      .setCustomId("hide")
      .setLabel("Hide")
      .setStyle(ButtonStyle.Secondary);

    let roles = r.map((r) => r).join("\n");
    let editEmbed = new EmbedBuilder();
    editEmbed
      .setTitle(`SERVER ROLES`)
      .setDescription(roles)
      .setColor(client.colors.main);

    await interaction.editReply({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(button1)],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (button) => {
        if (button.user.id === interaction.user.id) return true;
        else {
          button.reply({
            content: `Only **${interaction.user.username}** can use this button, run the command again to use the buttons.`,
            ephemeral: true,
          });
          return false;
        }
      },
      time: 60000,
      idle: 60000 / 2,
    });

    collector.on("end", async () => {
      try {
        await interaction.editReply({
          components: [
            new ActionRowBuilder().addComponents(button1.setDisabled(true)),
          ],
        });
      } catch (error) {
        throw error;
      }
    });

    collector.on("collect", async (button) => {
      if (!button.deferred) await button.deferUpdate();

      if (button.customId === "hide") {
        return await interaction.editReply({
          embeds: [embed],
          components: [new ActionRowBuilder().addComponents(button1)],
        });
      }

      if (button.customId === "show") {
        return await interaction.editReply({
          embeds: [editEmbed],
          components: [new ActionRowBuilder().addComponents(button2)],
        });
      }
    });
  },
};
