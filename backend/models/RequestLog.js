// models/RequestLog.js
const mongoose = require("mongoose");

const requestLogSchema = new mongoose.Schema({
  method: { type: String, required: true },
  url: { type: String, required: true },
  ip: { type: String, required: true },
  headers: { type: Object },
  body: { type: Object },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RequestLog", requestLogSchema);