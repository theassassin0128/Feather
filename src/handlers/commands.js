async function commands(client) {
  const { REST, Routes } = require("discord.js");
  const rest = new REST({ version: "10" }).setToken(client.config.token);
  const { loadFiles } = require("../functions/loadFiles");
  const ascii = require("ascii-table");

  await client.commands.clear();
  const applicationGuildCommands = new Array();

  const table = new ascii("COMMANDS")
    .setBorder("│", "─", " ", " ")
    .setHeading("FILES", "STATUS");
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

      table.addRow(file.split("\\").pop(), "✔");
    } catch (error) {
      table.addRow(file.split("\\").pop(), `❌ | ${file}`);
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

  console.log(table.toString());
  client.log("loaded commands", "log");
}

module.exports = { commands };
