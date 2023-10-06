const { TEST_SERVER_ID, MAIN_SERVER_ID, BOT_ID, DISCORD_TOKEN } = process.env;
const { Client, REST, Routes } = require("discord.js");
const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
const { glob } = require("glob");
const path = require("path");
const ascii = require("ascii-table");

/**
 *
 * @param {Client} client
 * @returns
 */
async function loadCommands(client) {
  const table = new ascii("BOT COMMNDS").setHeading("files", "status");
  const applicationGuildCommands = [];
  const applicationCommands = [];

  const files = await glob(
    path.join(`${process.cwd()}`, "src/commands", "**/*.js").replace(/\\/g, "/")
  );

  for (const file of files) {
    try {
      const commandObject = require(file);

      client.commands.set(commandObject.data.name, commandObject);

      if (commandObject.test) {
        applicationGuildCommands.push(commandObject.data);
      } else {
        applicationCommands.push(commandObject.data);
      }

      table.addRow(file.split("/").pop(), "✅️");
    } catch (error) {
      table.addRow(file.split("/").pop(), `❌️: ${error}`);
    }
  }

  rest.put(Routes.applicationGuildCommands(BOT_ID, TEST_SERVER_ID), {
    body: applicationGuildCommands,
  });
  rest.put(Routes.applicationCommands(BOT_ID), {
    body: applicationCommands,
  });

  return console.log(table.toString());
}

module.exports = { loadCommands };
