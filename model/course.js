const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  lecturer_id: { type: String },
});

module.exports = mongoose.model("user", userSchema);