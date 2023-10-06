require("dotenv").config();
const { DISCORD_TOKEN } = process.env;
const {
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
} = require("discord.js");
const { MongoClient } = require("mongodb");
const { DATABASE_URL } = process.env;

const { loadEvents } = require("./handlers/loadEvents");
const { loadCommands } = require("./handlers/loadCommands");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
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
});

client.mongodb = new MongoClient(DATABASE_URL);
client.events = new Collection();
client.commands = new Collection();

process.on("unhandledRejection", (error) => console.error(error));
process.on("uncaughtException", (error) => console.error(error));

(async () => {
	try {
		await loadEvents(client);
		await loadCommands(client);
		client.login(DISCORD_TOKEN);
	} catch (error) {
		console.error(error);
	}
})();
