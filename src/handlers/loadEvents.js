const { loadFiles } = require("../functions/loadFiles");

async function loadEvents(client) {
  console.time("Load Time");
  client.events = new Map();
  const events = new Array();

  const files = await loadFiles("src/events");

  for (const file of files) {
    try {
      const eventObject = require(file);
      const execute = (...args) => eventObject.execute(...args, client);
      const target = eventObject.rest ? client.rest : client;

      target[eventObject.once ? "once" : "on"](eventObject.name, execute);
      client.events.set(eventObject.name, execute);

      events.push({
        Events: file.split("/").pop().slice(0, -3) + ".js",
        Status: "✅️",
      });
    } catch (error) {
      events.push({
        Command: file.split("/").pop().slice(0, -3),
        Status: "❌️",
      });
      console.error(error);
    }
  }

  console.table(events, ["Events", "Status"]);
  console.timeEnd("Load Time");
}

module.exports = { loadEvents };
