const mongoose = require('mongoose');

const SettingsInvoiceSchema = new mongoose.Schema({
  company_name: { type: String, required: true },
  logopath: { type: String },
  owner: { type: String, required: true },
  address: { type: String, required: true },
  geocode: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  fax: { type: String }
});

const SettingsInvoice = mongoose.model('SettingsInvoice', SettingsInvoiceSchema);

module.exports = SettingsInvoice;
