const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase:true
    }, 
    password: {
        type: String,
        required: true,
        trim: true,
    }
})

module.exports = mongoose.model('user', userSchema)