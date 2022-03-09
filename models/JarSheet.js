const mongoose = require('mongoose');

const JarSheetSchema = mongoose.Schema({
    name: String, 
    slug: String,
    description: String,
    income: Number,
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
    jars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jars',
      }
    ]
})


module.exports =  mongoose.model('jarsheets', JarSheetSchema);