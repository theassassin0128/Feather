async function events(client) {
  const ascii = require("ascii-table");
  const { loadFiles } = require("../functions/loadFiles");

  await client.events.clear();

  const table = new ascii("EVENTS")
    .setBorder("│", "─", " ", " ")
    .setHeading("FILES", "STATUS");
  const files = await loadFiles("src/events");

  for (const file of files) {
    try {
      const eventObject = require(file);
      const execute = (...args) => eventObject.execute(...args, client);
      const target = eventObject.rest ? client.rest : client;

      client.events.set(eventObject.name, execute);

      if (eventObject.distube) client.distube.on(eventObject.name, execute);
      else target[eventObject.once ? "once" : "on"](eventObject.name, execute);

      table.addRow(file.split("\\").pop(), "✔");
    } catch (error) {
      table.addRow(file.split("\\").pop(), `❌ | ${file}`);
    }
  }

  console.log(table.toString());
  return client.log("loaded events", "log");
}

module.exports = { events };
