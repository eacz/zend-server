const mongoose = require('mongoose');

const LinkSchema = mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    original_name: {
        type: String,
        required: true,
    },
    downloads: {
        type: Number,
        default: 1,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
    password: {
        type: String,
        default: null
    },
    created: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('link', LinkSchema);
