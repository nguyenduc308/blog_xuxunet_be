const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: String,
  role: {
    type: String,
    enum: ['user', 'mod', 'admin'],
    default: 'user'
  },
  password: String,
  first_name: String,
  last_name: String,
  avatar_url: String,
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