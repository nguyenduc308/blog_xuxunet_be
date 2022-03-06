const mongoose = require('mongoose');

const TrackingSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true
  },
  name: String,
  ref: Object,
  description: String,
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users',
  },
  clicks: {
    type: Number,
    default: 0,
  },
  time: {
    type: Number,
    default: 0,
  },
  expired_at: Date,
  deleted_at: Date,
  updated_at: {
    type: Date,
    default: new Date()
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});


module.exports = mongoose.model('tracking', TrackingSchema);