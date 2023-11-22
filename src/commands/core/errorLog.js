const errorlog = client.mongodb.db("test").collection("errorlog");
if (!errorlog) client.mongodb.db("test").createCollection("errorlog");

const doc = await errorlog.findOne({ Guild: interaction.guild.id });

switch (interaction.options.getSubcommand()) {
  case "setup":
    {
      const channel =
        interaction.options.getChannel("channel") || interaction.channel;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTitle("Setup Complete")
        .setDescription(
          `\`\`\`js\nmodule.exports = {\n  server: ${`{\n    name: "${interaction.guild.name}",\n    id: "${interaction.guild.id}"\n  }`},\n  channel: ${`{\n    name: "${channel.name}",\n    id: "${channel.id}"\n  }`},\n  enabled: true\n};\n\`\`\`\n\nFrom today onward all error logs and messages will be send to ${channel}`
        )
        .setThumbnail(interaction.guild.iconURL())
        .setColor(colours.main)
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      if (!doc) {
        await errorlog.insertOne({
          Guild: interaction.guild.id,
          Channel: channel.id,
          Enabled: "true",
        });

        interaction.reply({
          embeds: [embed],
        });
      } else {
        await errorlog.updateOne(
          { _id: doc._id },
          { $set: { Channel: channel.id, Guild: interaction.guild.id } }
        );

        interaction.reply({
          embeds: [embed],
        });
      }
    }
    break;
  case "toggle":
    {
      if (!doc) {
        return interaction.reply({
          content: "errorlog channel is not setup.",
          ephemeral: true,
        });
      }

      const toggle = await errorlog.distinct("Enabled", { _id: doc._id });

      if (toggle == "true") {
        errorlog.updateOne({ _id: doc._id }, { $set: { Enabled: "false" } });

        interaction.reply({
          content: `Toggle **off** the errorlog.`,
          ephemeral: true,
        });
      }
      if (toggle == "false") {
        errorlog.updateOne({ _id: doc._id }, { $set: { Enabled: "true" } });
        return interaction.reply({
          content: `Toggle **on** the errorlog.`,
          ephemeral: true,
        });
      }
    }
    break;
  case "delete":
    {
      if (!doc) {
        interaction.reply({
          content: "**Their is no errorlog channel**",
          ephemeral: true,
        });
      } else {
        await errorlog.deleteOne({ _id: doc._id });
        interaction.reply({
          content: "**Successfully deleted errorlog data.**",
          ephemeral: true,
        });
      }
    }
    break;
  case "info":
    {
      const guild = doc ? await client.guilds.fetch(doc.Guild) : "";
      const channel = guild
        ? (await guild.channels.fetch()).get(doc.Channel)
        : "";

      const info = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTitle("ERROR LOG INFO")
        .setDescription(
          `\`\`\`js\nmodule.exports = {\n  server: ${
            guild
              ? `{\n    name: "${guild.name}",\n    id: "${guild.id}"\n  }`
              : `"Not Setup"`
          },\n  channel: ${
            channel
              ? `{\n    name: "${channel.name}",\n    id: "${channel.id}"\n  }`
              : `"Not Setup"`
          },\n  enabled: ${doc ? `${doc.Enabled}` : "false"}\n};\n\`\`\``
        )
        .setThumbnail(guild ? guild.iconURL() : null)
        .setColor(colours.main)
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      interaction.reply({
        embeds: [info],
      });
    }
    break;
}

const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const errorLog = require("../../schemas/errorLog.js");
const { colours } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("errorlog")
    .setDescription("Setup the Error logging channel.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((option) =>
      option
        .setName("setup")
        .setDescription("Setup the error log channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Select a channel.")
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((option) =>
      option.setName("toggle").setDescription("Toggle between on/off.")
    )
    .addSubcommand((option) =>
      option.setName("delete").setDescription("Delete's the error log system.")
    )
    .addSubcommand((option) =>
      option
        .setName("info")
        .setDescription("Get information regarding error log system.")
    ),
  test: true,
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (interaction, client) => {
    switch (interaction.options.getSubcommand()) {
      case "setup":
        {
          const channel =
            interaction.options.getChannel("channel") || interaction.channel;

          const embed = new EmbedBuilder()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(
              `***Setup Complete***\n\nGuild : ${interaction.guild.id} | ${interaction.guild.name}\nChannel : ${channel.id} | <#${channel.id}>\nEnabled : *True*`
            )
            .setColor(colours.main)
            .setFooter({
              text: interaction.guild.name,
              iconURL: interaction.guild.iconURL(),
            })
            .setTimestamp();

          const DOC = await errorLog.findOne({
            Guild: interaction.guild.id,
          });

          if (!DOC) {
            await errorLog.create({
              Guild: interaction.guild.id,
              Channel: channel.id,
              Enabled: "true",
            });

            return interaction.reply({
              embeds: [embed],
              ephemeral: true,
            });
          } else {
            DOC.$set("Channel", `${channel.id}`);
            DOC.save();

            return interaction.reply({
              content: `***Changed***\nChannel : ${channel.id} | <#${channel.id}>`,
              ephemeral: true,
            });
          }
        }
        break;
      case "toggle":
        {
          const DOC = await errorLog.findOne({
            Guild: interaction.guild.id,
          });

          if (!DOC) {
            return interaction.reply({
              content: "error-log channel is not setup.",
              ephemeral: true,
            });
          }

          const toggle = DOC.get("Enabled");

          if (toggle == "true") {
            DOC.$set("Enabled", "false");
            DOC.save();

            return interaction.reply({
              content: `Toggle **off** the error-log.`,
              ephemeral: true,
            });
          }
          if (toggle == "false") {
            DOC.$set("Enabled", "true");
            DOC.save();

            return interaction.reply({
              content: `Toggle **on** the error-log.`,
              ephemeral: true,
            });
          }
        }
        break;
      case "delete":
        {
          const DOC = await errorLog.findOne({
            Guild: interaction.guild.id,
          });
          if (!DOC) {
            interaction.reply({
              content: "**Their is no error-log channel setup**",
              ephemeral: true,
            });
          } else {
            await errorLog.deleteOne({ Guild: interaction.guild.id });
            interaction.reply({
              content: "**Successfully deleted error-log channel.**",
              ephemeral: true,
            });
          }
        }
        break;
    }
  },
};
