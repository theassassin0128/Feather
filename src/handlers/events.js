const chalk = require("chalk");
const { loadFiles } = require("../functions/loadFiles");

async function events(client) {
  await client.events.clear();

  const files = await loadFiles("src/events");

  for (const file of files) {
    try {
      const eventObject = require(file);
      const execute = (...args) => eventObject.execute(...args, client);
      const target = eventObject.rest ? client.rest : client;

      client.events.set(eventObject.name, execute);

      if (eventObject.distube) client.distube.on(eventObject.name, execute);
      else target[eventObject.once ? "once" : "on"](eventObject.name, execute);
    } catch (error) {
      throw error;
    }
  }

  return client.log("loaded events", "log");
}

module.exports = { events };
