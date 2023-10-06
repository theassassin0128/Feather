const {
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
	resolvePartialEmoji,
	Client,
	ChatInputCommandInteraction,
	OAuth2Scopes,
} = require("discord.js");

module.exports = {
	data: {
		name: "invite",
		type: 1,
		description: "Replies with a list of my invite links.",
		dm_permission: false,
	},
	test: true,
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	execute: async (interaction, client) => {
		let link = client.generateInvite({
			permissions: BigInt(1539745246838),
			scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
		});
		const button = new ButtonBuilder()
			.setLabel("Invite Link")
			.setStyle(ButtonStyle.Link)
			.setURL(link)
			.setEmoji(resolvePartialEmoji("✉️"));

		const AR = new ActionRowBuilder().addComponents(button);

		interaction.reply({
			content: "Invite me by clicking the button.",
			ephemeral: false,
			components: [AR],
		});
	},
};
