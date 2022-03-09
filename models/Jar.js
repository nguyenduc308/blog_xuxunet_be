const mongoose = require('mongoose');

const JarSchema = mongoose.Schema({
    name: String, 
    slug: String,
    description: String,
    color: String,
    bg_color: String,
    percent: Number,
    amount: Number,
    index: Number,

    deleted_at: Date,
    created_at: {
      type: Date,
      default: new Date(),
    },
    updated_at: {
      type: Date,
      default: new Date(),
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    jarsheet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'jarsheets'
    },
})


module.exports =  mongoose.model('jars', JarSchema);