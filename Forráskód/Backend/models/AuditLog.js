const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actionType: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    enum: ['list', 'product', 'user'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema); 