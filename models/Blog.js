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
})


module.exports =  mongoose.model('blogs', BlogSchema);