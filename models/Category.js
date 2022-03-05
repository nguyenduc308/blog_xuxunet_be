const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: String, 
    slug: String,
    image_url: String,
    description: String,
    show_image: Boolean,
    color: String,
    bg_color: String,
    deleted_at: Date,
    created_at: Date,
    updated_at: Date,
})


module.exports =  mongoose.model('categories', CategorySchema);