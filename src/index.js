require("dotenv").config();
const { DISCORD_TOKEN } = process.env;
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");

const { loadEvents } = require("./handlers/loadEvents");
const { loadCommands } = require("./handlers/loadCommands");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.User,
    Partials.Message,
    Partials.GuildMember,
    Partials.ThreadMember,
    Partials.Channel,
    Partials.Reaction,
  ],
  allowedMentions: {
    repliedUser: false,
  },
  failIfNotExists: true,
});

client.config = require("./config.json");

const config = require("./config.json");
client.emotes = config.emoji;

client.commands = new Collection();
client.events = new Collection();

process.on("unhandledRejection", (error) => console.error(error));

(async () => {
  try {
    await loadEvents(client);
    await loadCommands(client);
    client.login(DISCORD_TOKEN);
  } catch (error) {
    console.error(error);
  }
})();
