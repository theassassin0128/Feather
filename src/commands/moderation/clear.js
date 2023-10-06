const {
	EmbedBuilder,
	ChatInputCommandInteraction,
	Client,
	SlashCommandBuilder,
	PermissionFlagsBits,
} = require("discord.js");
const { colours } = require("../../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription("🗑️ Purge messages of a channel.")
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setDescription("The number of messages to delete.")
				.setRequired(true)
				.setMaxValue(100)
				.setMinValue(1)
		)
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("Select a Guild Member.")
				.setRequired(false)
		),
	test: true,
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	execute: async (interaction, client) => {
		const amount = interaction.options.getInteger("amount");
		const target = interaction.options.getUser("target");
		const embed = new EmbedBuilder()
			.setAuthor({
				name: client.user.tag,
				iconURL: client.user.displayAvatarURL(),
			})
			.setColor(colours.main)
			.setFooter({
				text: interaction.guild.name,
				iconURL: interaction.guild.iconURL(),
			})
			.setTimestamp();

		const deletedMessages = await interaction.channel.bulkDelete(amount, true);

		interaction.reply({
			embeds: [
				embed.setDescription(
					`🧹️ Purged \`${deletedMessages.size}\` messages from <#${interaction.channel.id}>\nRequested by: **<@${interaction.user.id}>**`
				),
			],
			ephemeral: true,
		});
	},
};
