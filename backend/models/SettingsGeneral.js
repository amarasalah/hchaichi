// models/SettingsGeneral.js
const mongoose = require('mongoose');

const SettingsGeneralSchema = new mongoose.Schema({
  meta_title: { type: String, required: true },
  meta_description: { type: String },
  meta_keywords: { type: String },
});

const SettingsGeneral = mongoose.model('SettingsGeneral', SettingsGeneralSchema);

module.exports = SettingsGeneral;
