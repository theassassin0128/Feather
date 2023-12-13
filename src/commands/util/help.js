const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonStyle,
  Client,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  category: "Utility",
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help with all commands or one specific command."),
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */

  execute: async (interaction, client) => {
    await interaction.deferReply({});

    const embed = new EmbedBuilder()
      .setTitle(`${client.user.username} Help`)
      .setDescription(
        `Hey <@${interaction.member.user.id}>, I'm <@${client.user.id}>!\n\nA Discord bot with many awesome features.\n\n🔰 • Moderation\n📩 • Tickets\n⚒ • Utility\n⚙ • Config\n\n*Choose an category below button to see commands.*\n\n`
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(client.colors.main)
      .setTimestamp()
      .setFooter({
        text: `Requested by: ${interaction.member.user.username}`,
        iconURL: interaction.member.user.displayAvatarURL(),
      });

    let but1 = new ButtonBuilder()
      .setCustomId("home")
      .setLabel("Home")
      .setStyle(ButtonStyle.Success);

    let but2 = new ButtonBuilder()
      .setCustomId("moderation")
      .setLabel("Moderation")
      .setStyle(ButtonStyle.Primary);

    let but3 = new ButtonBuilder()
      .setCustomId("ticket")
      .setLabel("Ticket")
      .setStyle(ButtonStyle.Primary);

    let but4 = new ButtonBuilder()
      .setCustomId("utility")
      .setLabel("Utility")
      .setStyle(ButtonStyle.Primary);

    let but5 = new ButtonBuilder()
      .setCustomId("config")
      .setLabel("Config")
      .setStyle(ButtonStyle.Primary);

    let select = new StringSelectMenuBuilder()
      .setCustomId("selectMenu")
      .setPlaceholder("Select a command category.")
      .setMaxValues(1)
      .setMinValues(1)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Home")
          .setDescription("Home commands.")
          .setValue("home"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Moderation")
          .setDescription("Moderation commands.")
          .setValue("moderation"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Ticket")
          .setDescription("Ticket commands.")
          .setValue("Ticket"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Utility")
          .setDescription("Utility commands")
          .setValue("utility"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Config")
          .setDescription("Config commands")
          .setValue("config")
      );

    let commands;
    let editEmbed = new EmbedBuilder();

    await interaction.editReply({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(but1, but2, but3, but4, but5),
        new ActionRowBuilder().addComponents(select),
      ],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (b) => {
        if (b.user.id === interaction.user.id) return true;
        else {
          b.reply({
            ephemeral: true,
            content: `Only **${interaction.user.username}** can use this button, run the command again to use the help menu.`,
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
            new ActionRowBuilder().addComponents(
              but1.setDisabled(true),
              but2.setDisabled(true),
              but3.setDisabled(true),
              but4.setDisabled(true),
              but5.setDisabled(true)
            ),
            new ActionRowBuilder().addComponents(select.setDisabled(true)),
          ],
        });
      } catch (error) {
        throw error;
      }
    });

    collector.on("collect", async (b) => {
      if (!b.deferred) await b.deferUpdate();

      if (b.customId === "home") {
        return await interaction.editReply({
          embeds: [embed],
          components: [
            new ActionRowBuilder().addComponents(
              but1.setDisabled(true),
              but2.setDisabled(false),
              but3.setDisabled(false),
              but4.setDisabled(false),
              but5.setDisabled(false)
            ),
          ],
        });
      }

      if (b.customId === "moderation") {
        commands = client.commands
          .filter((x) => x.category && x.category === "Moderation")
          .map((x) => `\`${x.data.name}\``);
        editEmbed
          .setColor(client.colors.main)
          .setDescription(commands.join(", "))
          .setTitle("Moderation Commands")
          .setFooter({
            text: `Total ${commands.length} Mopderation commands.`,
          });

        return await interaction.editReply({
          embeds: [editEmbed],
          components: [
            new ActionRowBuilder().addComponents(
              but1.setDisabled(false),
              but2.setDisabled(true),
              but3.setDisabled(false),
              but4.setDisabled(false),
              but5.setDisabled(false)
            ),
          ],
        });
      }

      if (b.customId == "ticket") {
        commands = client.commands
          .filter((x) => x.category && x.category === "Ticket")
          .map((x) => `\`${x.data.name}\``);

        editEmbed
          .setColor(client.colors.main)
          .setDescription(commands.join(", "))
          .setTitle("Ticket Commands")
          .setFooter({
            text: `Total ${commands.length} ticket commands.`,
          });

        return await interaction.editReply({
          embeds: [editEmbed],
          components: [
            new ActionRowBuilder().addComponents(
              but1.setDisabled(false),
              but2.setDisabled(false),
              but3.setDisabled(true),
              but4.setDisabled(false),
              but5.setDisabled(false)
            ),
          ],
        });
      }

      if (b.customId == "utility") {
        commands = client.commands
          .filter((x) => x.category && x.category === "Utility")
          .map((x) => `\`${x.data.name}\``);

        editEmbed
          .setColor(client.colors.main)
          .setDescription(commands.join(", "))
          .setTitle("Utility Commands")
          .setFooter({ text: `Total ${commands.length} Utility commands.` });

        return await interaction.editReply({
          embeds: [editEmbed],
          components: [
            new ActionRowBuilder().addComponents(
              but1.setDisabled(false),
              but2.setDisabled(false),
              but3.setDisabled(false),
              but4.setDisabled(true),
              but5.setDisabled(false)
            ),
          ],
        });
      }
      if (b.customId == "config") {
        commands = client.commands
          .filter((x) => x.category && x.category === "Config")
          .map((x) => `\`${x.data.name}\``);

        editEmbed
          .setColor(client.colors.main)
          .setDescription(commands.join(", "))
          .setTitle("Config Commands")
          .setFooter({ text: `Total ${commands.length} config commands.` });

        return await interaction.editReply({
          embeds: [editEmbed],
          components: [
            new ActionRowBuilder().addComponents(
              but1.setDisabled(false),
              but2.setDisabled(false),
              but3.setDisabled(false),
              but4.setDisabled(false),
              but5.setDisabled(true)
            ),
          ],
        });
      }
    });
  },
};
