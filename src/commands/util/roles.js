const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  ChatInputCommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Message,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Get a list of server roles and member counts.")
    .setDMPermission(false),
  category: "Utility",
  aliases: ["roles"],
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
        `Hi! **<@${interaction.user.id}>**,\n\n**/Roles** command is an special kind of command that sort and shows you the full list of roles in a server.`
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

    let roles = r.map((r) => r).join("\n");
    let roleEmbed = new EmbedBuilder()
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

      if (button.customId === "show") {
        return await interaction.followUp({
          embeds: [roleEmbed],
          ephemeral: true,
        });
      }
    });
  },

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @returns
   */
  run: async (client, message, args) => {
    const r = message.guild.roles.cache.sort((a, b) => b.position - a.position);

    if (r.size > 100)
      return message.reply({
        content: `Too many roles to display. About [${r.size - 1}] roles.`,
      });

    const embed = new EmbedBuilder()
      .setTitle(message.guild.name)
      .setDescription(
        `Hi! **<@${message.author.id}>**,\n\n**/Roles** command is an special kind of command that sort and shows you the full list of roles in a server.`
      )
      .setColor(client.colors.main)
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      .setFooter({
        text: `Requested by: ${message.member.user.username}`,
        iconURL: message.member.user.displayAvatarURL(),
      });

    let button1 = new ButtonBuilder()
      .setCustomId("show")
      .setLabel("Show")
      .setStyle(ButtonStyle.Secondary);

    let roles = r.map((r) => r).join("\n");
    let roleEmbed = new EmbedBuilder()
      .setTitle(`SERVER ROLES`)
      .setDescription(roles)
      .setColor(client.colors.main);

    const repliedMessage = await message.reply({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(button1)],
    });

    const collector = message.channel.createMessageComponentCollector({
      filter: (button) => {
        if (button.user.id === message.author.id) return true;
        else {
          button.reply({
            content: `Only **${message.author.username}** can use this button, run the command again to use the buttons.`,
          });
          return false;
        }
      },
      time: 60000,
      idle: 60000 / 2,
    });

    collector.on("end", async () => {
      try {
        await repliedMessage.edit({
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

      if (button.customId === "show") {
        return repliedMessage.reply({
          embeds: [roleEmbed],
        });
      }
    });
  },
};
