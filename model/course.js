const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String },
  user_id: { type: String },
});

module.exports = mongoose.model("course", courseSchema);