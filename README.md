[![CodeQL](https://github.com/theassassin0128/Feather/actions/workflows/codeql.yml/badge.svg)](https://github.com/theassassin0128/Feather/actions/workflows/codeql.yml)
[![Dependency Review](https://github.com/theassassin0128/Feather/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/theassassin0128/Feather/actions/workflows/dependency-review.yml)

# FEATHER

**Feather** is a multipurpose discord Bot. It is still in development. Specially made for _Moderation_ & _Server-Management_. It was made with [discord.js](https://github.com/discordjs/discord.js) which is a powerful [**Node.js**](https://nodejs.org/en/) module that allows you to easily interact with the [Discord API](https://discord.com/developers/docs/intro).

## Road Map

- [x] **Basic Bot**
- [ ] **Moderation Bot**
- [ ] **Website**
- [ ] **Chat Bot**
- [ ] **Web based Dashboard**

## Features

- **Error Logging System**

## Get Started

1. Copy `.env.example` to `.env` and fill in the values as detailed below.
1. Create a [MongoDB](https://www.mongodb.com/) database and fill in `DATABASE_URL`.
1. Create a Discord application at https://discord.com/developers/applications.
1. Go to the Bot tab and click "Add Bot"
   - Click "Reset Token" and fill in `DISCORD_TOKEN`
   - Disable "Public Bot" unless you want your bot to be visible to everyone
   - Enable "Server Members Intent", "Presence Intent" and "Message Content Intent" under "Privileged Gateway Intents"
1. Go to the OAuth2 tab (General), copy your "Client ID", and fill in `BOT_ID`.
1. Install dependencies and run the bot
   ```
   npm install
   npm start
   ```
1. Now go to URL generator tab, in scopes select "bot", "application.commands" scroll down select "Administrator" permission copy the url and invite the bot to your server.
1. Start using the bot. Use `/help` or `/botinfo` command.

## Customization

1. Change embed colours by simply changing values of "colours" in `src/config.json`.
1. Manage dev-commands access by adding or removing ids from "devs" in `src/config.json`.
1. Change links of `github`, `discord server`, `images` to your liking in `src/config.json`.

> **Note** : use hexadecimal code for the colours. (example: #FF0000 means "RED" ; # is optional)

## Commands

| Name       | description                                                      |
| ---------- | ---------------------------------------------------------------- |
| botinfo    | Replies with bot's stats in an embed message                     |
| invite     | Returns a link button with embeded invite-link.                  |
| roleinfo   | Similar to botinfo replies with information of a server role     |
| roles      | Replies with an embed message with full list of roles (UpTo 150) |
| serverinfo | Same as roleinfo replies with info about a discord server        |
| memberinfo | Same as serverinfo replies with information of a discord user    |

Written above are some basic commands of the bot.

## Development

Feather is an alternative version of [Node](https://github.com/theassassin0128/Node#README.md). Feather Bot was made to be used in personal servers. But you can use it as a public bot by doing some minor changes. Just remember that you will be on your on if you do so. Also I am not going to commit regularly.

**Please! Help me if you can. Cause I'm still a Newbie.**
