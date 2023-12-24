async function events(client) {
  const { loadFiles } = require("../functions/loadFiles");

  await client.events.clear();

  const eventsArray = [];
  const files = await loadFiles("src/events");

  for (const file of files) {
    try {
      const eventObject = require(file);
      const execute = (...args) => eventObject.execute(...args, client);
      const target = eventObject.rest ? client.rest : client;

      client.events.set(eventObject.name, execute);

      if (eventObject.distube) client.distube.on(eventObject.name, execute);
      else target[eventObject.once ? "once" : "on"](eventObject.name, execute);

      eventsArray.push({
        FILES: file.split("/").pop(),
        STATUS: "✅",
      });
    } catch (error) {
      eventsArray.push({
        FILES: file.split("/").pop(),
        STATUS: `❌ | ${error}`,
      });
    }
  }

  console.table(eventsArray, ["FILES", "STATUS"]);
  return client.log("loaded events", "log");
}

module.exports = { events };
