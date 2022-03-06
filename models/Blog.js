const mongoose = require('mongoose');

const BlogSchema = mongoose.Schema({
    title: String, 
    slug: {
      type: String,
      unique: true,
    },
    status: {
        type: String,
        enum: ['draft', 'public'],
        default: 'public'
    },
    featured_image_url: String,
    excerpt: String,
    show_featured_image: Boolean,
    content: String,
    blocks: Object,

    deleted_at: Date,
    deleted_by: {
      type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    created_at: Date,
    updated_at: Date,
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
})


module.exports =  mongoose.model('blogs', BlogSchema);