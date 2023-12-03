const { TEST_SERVER_ID, BOT_ID, DISCORD_TOKEN } = process.env;
const { REST, Routes } = require("discord.js");
const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
const { loadFiles } = require("../functions/loadFiles");

async function loadCommands(client) {
  console.time("Time");

  await client.commands.clear();
  const commands = new Array();
  const applicationGuildCommands = new Array();

  const files = await loadFiles("src/commands");

  for (const file of files) {
    try {
      const commandObject = require(file);

      client.commands.set(commandObject.data.name, commandObject);
      commands.push({
        Commands: file.split("/").pop(),
        Status: "✅️",
      }); //Replace "/" with "\\" if you are using mac/linux

      if (commandObject.execute)
        applicationGuildCommands.push(commandObject.data);
    } catch (error) {
      commands.push({
        Commands: file,
        Status: "❌️",
      });
      console.error(error);
    }
  }

  rest.put(Routes.applicationGuildCommands(BOT_ID, TEST_SERVER_ID), {
    body: applicationGuildCommands,
  });

  console.table(commands, ["Commands", "Status"]);
  console.timeEnd("Time");
}

module.exports = { loadCommands };
