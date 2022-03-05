const mongoose = require('mongoose');


const ViewSchema = mongoose.Schema({
    count: Number,
    blog: {type: mongoose.Schema.Types.ObjectId, ref: 'blogs'},
    created_at: Date,
    updated_at: Date,
})

module.exports = mongoose.model('views', ViewSchema);