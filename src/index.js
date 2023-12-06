require("dotenv").config();
const { DISCORD_TOKEN } = process.env;
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const config = require("./config.json");
const { events } = require("./handlers/events");
const { commands } = require("./handlers/commands");
const { errors } = require("./handlers/errors");
const { sendErrors } = require("./functions/sendErrors");

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

client.log = require("./functions/log");
client.aliases = new Collection();
client.commands = new Collection();
client.events = new Collection();

(async () => {
  try {
    await client.login(DISCORD_TOKEN);
    errors();
    events(client);
    commands(client);
  } catch (error) {
    await sendErrors(error, client);
    console.error(error);
  }
})();
