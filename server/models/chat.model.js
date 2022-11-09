const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    user:String,
    message:String,
    id:String
})
module.exports = mongoose.model('Chat',chatSchema)