const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actionType: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'SHARE', 'LOGIN', 'LOGOUT', 'REGISTER']
  },
  targetType: {
    type: String,
    enum: ['list', 'product', 'user']
  },
  targetId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ user: 1, actionType: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);