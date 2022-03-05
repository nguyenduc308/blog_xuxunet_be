const mongoose = require('mongoose');


const CommentSchema = mongoose.Schema({
    content: String,
    blog: {type: mongoose.Schema.Types.ObjectId, ref: 'blogs'},
    reply: [{type: mongoose.Schema.Types.ObjectId, ref: 'comments'}]
})

module.exports = mongoose.model('comments', CommentSchema);
