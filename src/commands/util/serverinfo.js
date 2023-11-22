const {
  EmbedBuilder,
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  ChannelType,
} = require("discord.js");
const moment = require("moment");
const { colours } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Replies with server information.")
    .setDMPermission(false),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (interaction, client) => {
    interaction.deferReply();
    const { guild } = interaction;
    var Roles = guild.roles.cache;
    var owner = (await guild.members.fetch()).get(guild.ownerId);
    var Channels = await guild.channels.fetch();

    let humans = 0;
    let bots = 0;
    let text = 0;
    let voice = 0;
    let category = 0;
    let stage = 0;
    let forum = 0;
    let announcement = 0;

    const allMembers = await guild.members.fetch();
    allMembers.forEach((member) => {
      if (member.user.bot) bots++;
      else humans++;
    });

    const allChannels = await guild.channels.fetch();
    allChannels.forEach((channel) => {
      if (channel.type == 0) text++; // GUILD_TEXT = 0
      if (channel.type == 2) voice++; // GUILD_VOICE = 2
      if (channel.type == 4) category++; // GUILD_CATEGORY = 4
      if (channel.type == 5) announcement++; // GUILD_ANNOUNCEMENT = 5
      if (channel.type == 13) stage++; //GUILD_STAGE_VOICE = 13
      if (channel.type == 15) forum++; //GUILD_FORUM = 15
    });

    var server = new EmbedBuilder()
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .addFields(
        {
          name: "🆔 ID",
          value: `${guild.id}`,
        },
        {
          name: "📅 Created On",
          value: `${moment(guild.createdAt).format(
            "dddd, MMMM Do YYYY, h:mm:ss A"
          )}\n - ${moment(guild.createdAt, "YYYYMMDD").fromNow()}`,
        },
        {
          name: "👑 Owned by",
          value: `${owner} | ${owner.id}`,
        },
        {
          name: `👥 Members [${guild.memberCount}]`,
          value: `Humans: ${humans}\nBots: ${bots}`,
        },
        {
          name: `💬 Channels [${Channels.size}]`,
          value: `Text: ${text} | Voice: ${voice}\nStage: ${stage} | Forum: ${forum}\nCategory: ${category} | Anouncment: ${announcement}`,
        },
        {
          name: `🔐 Roles [${Roles.size}]`,
          value: "Use `/roles` to get a list of roles",
        }
      )
      .setColor(colours.main)
      .setThumbnail(guild.iconURL());

    interaction.editReply({
      embeds: [server],
    });
  },
};
