const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./../models/User');
const Order = require('./../models/Order');
const Message = require('./../models/Message');

const notificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  type: {
    type: String,
    enum: ['order', 'message', 'general'],
    required: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order', // Assuming you have an Order model
    required: function() {
      return this.type === 'order';
    }
  },
  messageId: {
    type: Schema.Types.ObjectId,
    ref: 'Message', // Assuming you have a Message model
    required: function() {
      return this.type === 'message';
    }
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
