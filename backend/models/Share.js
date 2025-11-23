const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    length: 4
  },
  type: {
    type: String,
    enum: ['file', 'text'],
    required: true
  },
  // File specific fields
  originalName: {
    type: String,
    required: function() { return this.type === 'file'; }
  },
  storedName: {
    type: String,
    required: function() { return this.type === 'file'; }
  },
  mimeType: {
    type: String,
    required: function() { return this.type === 'file'; }
  },
  size: {
    type: Number,
    required: function() { return this.type === 'file'; }
  },
  // Text specific field
  text: {
    type: String,
    required: function() { return this.type === 'text'; }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Expire after 10 minutes
      return new Date(Date.now() + 10 * 60 * 1000);
    }
  },
  downloaded: {
    type: Boolean,
    default: false
  }
});

// Index for automatic document expiration
shareSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Share', shareSchema);
