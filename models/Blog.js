const mongoose = require('mongoose');

const BlogSchema = mongoose.Schema({
    title: String, 
    slug: String,
    status: {
        type: String,
        enum: ['deleted', 'draft', 'public'],
        default: 'public'
    },
    featured_image_url: String,
    excerpt: String,
    show_featured_image: Boolean,
    content: String,
    deleted_at: Date,
    created_at: Date,
    updated_at: Date,
    blocks: Object,
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    }],
    view: {
        type: mongoose.Schema.Types.ObjectId, ref: 'views'
    },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'likes'}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comments'}],
})


module.exports =  mongoose.model('blogs', BlogSchema);