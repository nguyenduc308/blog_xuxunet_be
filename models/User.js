const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'mod', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    minlength: 6,
  },
  first_name: String,
  last_name: String,
  avatar_url: String,
  status: {
    type: Number,
    enum: [0,1],
    default: 0,
  },
  active_code: String,
  actived_at: Date,
  banned_at: Date,
  deleted_at: String,
  updated_at: Date,
  created_at: Date,
});

UserSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
        return next();
    }

    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
  } catch (err) {
      return next(err);
  }
})

module.exports = mongoose.model('users', UserSchema);