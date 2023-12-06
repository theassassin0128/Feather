const { DATABASE_URL } = process.env;
const { Client } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "ready",
  once: true,
  rest: false,
  /**
   *
   * @param {Client} client
   */
  execute: async (client) => {
    if (!DATABASE_URL) return;
    try {
      mongoose.connect(DATABASE_URL);
      client.log("DATABASE connected.", "log");
    } catch (error) {
      throw error;
    }
  },
};
