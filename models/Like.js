const mongoose = require('mongoose');


const LikeSchema = mongoose.Schema({
    type: {
        type: String,
        enum: [
            'like',
            'heart',
            'smile',
            'haha',
            'angry',
            'sad',
            'unlike'
        ],
        default: 'like'
    },
    blog: {type: mongoose.Schema.Types.ObjectId, ref: 'blogs'},
    comment: {type: mongoose.Schema.Types.ObjectId, ref: 'comment'},
    created_at: Date,
    updated_at: Date,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
})

module.exports = mongoose.model('likes', LikeSchema)