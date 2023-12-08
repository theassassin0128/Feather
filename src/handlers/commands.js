async function commands(client) {
  const { REST, Routes } = require("discord.js");
  const rest = new REST({ version: "10" }).setToken(client.config.token);
  const { loadFiles } = require("../functions/loadFiles");

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

  rest.put(
    Routes.applicationGuildCommands(
      client.config.botId,
      client.config.serverId
    ),
    {
      body: applicationGuildCommands,
    }
  );

  client.log("loaded commands", "log");
}

module.exports = { commands };
