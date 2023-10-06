const { Client, Message } = require("discord.js");
const { BOT_PREFIX } = process.env;

module.exports = {
  name: "messageCreate",
  once: false,
  rest: false,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @returns
   */
  execute: async (message, client) => {
    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    if (message.author.bot) return;

    if (message.content.match(prefixMention)) {
      return message.reply(
        `Hello <@${message.author.id}>! I am **Feather 2.0** a discord bot. Use \`/help\` if you need help with commands.`
      );
    }
  },
};
