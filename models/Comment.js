const mongoose = require('mongoose');


const CommentSchema = mongoose.Schema({
    content: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    blog: {type: mongoose.Schema.Types.ObjectId, ref: 'blogs'},
    children: [{type: mongoose.Schema.Types.ObjectId, ref: 'comments'}],
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'comments'},
    created_at: Date,
    updated_at: Date,
})

module.exports = mongoose.model('comments', CommentSchema);
