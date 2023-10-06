const { glob } = require("glob");
const path = require("path");
const ascii = require("ascii-table");

async function loadEvents(client) {
  const table = new ascii("EVENTS").setHeading("files", "status");
  const files = await glob(
    path.join(`${process.cwd()}`, "src/events", "**/*.js").replace(/\\/g, "/")
  );

  for (const file of files) {
    try {
      const event = require(file);
      const execute = (...args) => event.execute(...args, client);
      const target = event.rest ? client.rest : client;

      target[event.once ? "once" : "on"](event.name, execute);
      client.events.set(event.name, execute);

      table.addRow(file.split("/").pop(), "✅️");
    } catch (error) {
      table.addRow(file.split("/").pop(), `❌️: ${error}`);
    }
  }
  return console.log(table.toString());
}

module.exports = { loadEvents };
