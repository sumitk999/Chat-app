const http = require('http')
const express = require('express')
const cors = require('cors')
const socketIo = require('socket.io')
const mongoose = require('mongoose')
const userModel = require('./models/user.model')
const chatModel = require('./models/chat.model')
const roomModel = require('./models/room.model')

const app = express()

app.use(cors())



mongoose.connect('mongodb://localhost/Chat')
.then(()=>{
   console.log('Mongodb connected');
})
.catch((err) =>{
   console.log(err);
})

const users=[];
// const mess = [];
const rooms = ["Room-1",'Room-2','Room-3']

app.get('/', (req, res) => {
   res.send("Hello")
})

app.get('/rooms', (req, res) => {
   // const data = 
   console.log(rooms);
   res.status(200).send("HIIII")
})
const server = http.createServer(app)
const io = socketIo(server)
io.on('connection',(socket)=>{
   socket.join("Room-1")
   let userId;
   io.emit('roomjoin',rooms)
   socket.on('joined',async ({user}) =>{
      users[socket.id]=user
      const newUser = await userModel.create({socketId:user})
      // socket.broadcast.emit('userJoined',{user:'Admin',message:`${newUser.socketId} has Joined`})
      const mss = await chatModel.find()
      socket.emit('welcome',mss)
      
   })

   socket.on('message',async ({message,id})=>{
      const msg = {user:users[socket.id],message,id:id}
      const mssgs = await chatModel.create({user:users[socket.id],message,id:id})
      io.emit('sendMessage',mssgs)
      // mess.push(mess)
      
   })

   socket.on('disconnect',async()=>{
      await userModel.findOneAndDelete({socketId:users[socket.id]})
      await chatModel.findOneAndDelete({user:users[socket.id]})
      socket.broadcast.emit('leave',{user:'Admin',message:`${users[socket.id]} has left`})
      
     
   })

})

const port = 4500 || process.env.PORT
server.listen(port, () => {
   console.log(`server is running on ${port}`);
})