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
    var default_prefix = BOT_PREFIX;

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(default_prefix)) return;
    if (!message.member) message.member = message.guild.fetchMember(message);

    const args = message.content
      .slice(default_prefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    var command = client.commands.get(cmd);

    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) command.run(client, message, args);
  },
};
