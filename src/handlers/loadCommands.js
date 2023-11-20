const { TEST_SERVER_ID, BOT_ID, DISCORD_TOKEN } = process.env;
const { REST, Routes } = require("discord.js");
const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
const { loadFiles } = require("../functions/loadFiles");

async function loadCommands(client) {
  console.time("Load Time");
  client.commands = new Map();
  const commands = new Array();
  const applicationGuildCommands = new Array();
  const applicationCommands = new Array();

  const files = await loadFiles("src/commands");

  for (const file of files) {
    try {
      const commandObject = require(file);

      client.commands.set(commandObject.data.name, commandObject);
      commands.push({
        Commands: file.split("\\").pop().slice(0, -3) + ".js",
        Status: "✅️",
      }); //Replace "\\" with "/" if you are using mac/linux

      if (commandObject.test) applicationGuildCommands.push(commandObject.data);
      else applicationCommands.push(commandObject.data);
    } catch (error) {
      commands.push({
        Commands: file.split("\\").pop().slice(0, -3) + ".js",
        Status: "❌️",
      }); //Replace "\\" with "/" if you are using mac/linux
      console.error(error);
    }
  }

  rest.put(Routes.applicationGuildCommands(BOT_ID, TEST_SERVER_ID), {
    body: applicationGuildCommands,
  });
  rest.put(Routes.applicationCommands(BOT_ID), {
    body: applicationCommands,
  });

  console.table(commands, ["Commands", "Status"]);
  console.timeEnd("Load Time");
}

module.exports = { loadCommands };
