const { loadFiles } = require("../functions/loadFiles");

async function loadEvents(client) {
  console.time("Time");
  await client.events.clear();
  const events = new Array();

  const files = await loadFiles("src/events");

  for (const file of files) {
    try {
      const eventObject = require(file);
      const execute = (...args) => eventObject.execute(...args, client);
      const target = eventObject.rest ? client.rest : client;

      if (eventObject.distube) client.distube.on(eventObject.name, execute);
      else target[eventObject.once ? "once" : "on"](eventObject.name, execute);

      client.events.set(eventObject.name, execute);

      events.push({
        Events: file.split("/").pop(),
        Status: "✅️",
      }); //Replace "/" with "\\" if you are using mac/linux
    } catch (error) {
      events.push({
        Events: file,
        Status: "❌️",
      });
      console.error(error);
    }
  }

  console.table(events, ["Events", "Status"]);
  console.timeEnd("Time");
}

module.exports = { loadEvents };
