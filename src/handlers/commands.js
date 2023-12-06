const { TEST_SERVER_ID, BOT_ID, DISCORD_TOKEN } = process.env;
const { REST, Routes } = require("discord.js");
const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
const { loadFiles } = require("../functions/loadFiles");

async function commands(client) {
  await client.commands.clear();
  const applicationGuildCommands = new Array();

  const files = await loadFiles("src/commands");

  for (const file of files) {
    try {
      const commandObject = require(file);

      client.commands.set(commandObject.data.name, commandObject);

      if (commandObject.aliases && Array.isArray(commandObject.aliases)) {
        commandObject.aliases.forEach((alias) => {
          client.aliases.set(alias, commandObject.data.name);
        });
      }

      if (commandObject.execute)
        applicationGuildCommands.push(commandObject.data);
    } catch (error) {
      throw error;
    }
  }

  rest.put(Routes.applicationGuildCommands(BOT_ID, TEST_SERVER_ID), {
    body: applicationGuildCommands,
  });

  client.log("loaded commands", "log");
}

module.exports = { commands };
