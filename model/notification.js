const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  date_created: { type: Date },
  date_expired: { type: Date },
  user_id: { type: String },
  course_id: { type: String },

});

module.exports = mongoose.model("notification", notificationSchema);