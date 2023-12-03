const { Schema, model } = require("mongoose");

const errorLogSchema = new Schema({
  Guild: String,
  Channel: String,
  Enabled: String,
});

module.exports = model("errorlog", errorLogSchema);
