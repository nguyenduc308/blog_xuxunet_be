const mongoose = require('mongoose');


const ViewSchema = mongoose.Schema({
    count: Number,
    blog: {type: mongoose.Schema.Types.ObjectId, ref: 'blogs'},
})

module.exports = mongoose.model('views', ViewSchema);