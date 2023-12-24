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
    const { getMemberCount } = require("../../functions/memberCount.js");
    const ascii = require("ascii-table");
    const table = new ascii("BOT INFO").setHeading("ITEMS", "VALUES");

    table.addRow("Username", client.user.username);
    table.addRow("Tag", client.user.tag);
    table.addRow("Id", client.user.id);
    table.addRow("Servers", client.guilds.cache.size);
    table.addRow("Members", await getMemberCount(client));

    console.log(table.toString());

    client.log(`Logged in as ${client.user.tag}`, "log");
  },
};
