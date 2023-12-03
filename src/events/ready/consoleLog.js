const { Client } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  rest: false,
  /**
   *
   * @param {Client} client
   */
  execute: async (client) => {
    console.log(
      "\n\x1b[36m%s\x1b[0m",
      `[Discord API]: Logged in as ${client.user.tag}`
    );
  },
};
