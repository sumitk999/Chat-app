
const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomname:String,
    roomno:Number
})

module.exports = mongoose.model('Room',roomSchema)