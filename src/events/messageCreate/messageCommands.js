const { Client, Message } = require("discord.js");

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
    try {
      var default_prefix = client.config.defaultPrefix;

      if (message.author.bot || !message.guild) return;
      if (!message.content.startsWith(default_prefix)) return;
      if (!message.member) message.member = message.guild.fetchMember(message);

      const args = message.content
        .slice(default_prefix.length)
        .trim()
        .split(/ +/g);

      const cmd = args.shift().toLowerCase();

      if (cmd.length === 0) return;

      var command = client.commands.get(cmd);

      if (!command)
        return message.reply(`:x: | There is no command name ${cmd}`);

      if (command.inVoiceChannel && !message.member.voice.channel) {
        return message.channel.send(
          `${client.emotes.error} | You must be in a voice channel!`
        );
      }

      command.run(client, message, args);
    } catch (error) {
      throw error;
    }
  },
};
