const mongoose = require('mongoose');
const User = require('./../models/User');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: false },
  read: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  attachment:
    {
        originalname: String,
        path: String
    }
,
},
{ timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
