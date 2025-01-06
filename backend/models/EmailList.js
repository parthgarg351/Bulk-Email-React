const mongoose = require('mongoose');

const emailListSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  listName: {
    type: String,
    required: true
  },
  emails: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmailList', emailListSchema);