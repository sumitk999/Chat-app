const http = require('http')
const express = require('express')
const cors = require('cors')
const socketIo = require('socket.io')
const { connect } = require('http2')

const app = express()

app.use(cors())

const users=[];
const mess = [];
const rooms = ["Room-1",'Room-2','Room-3']

app.get('/', (req, res) => {
   res.send("Hello")
})

const server = http.createServer(app)
const io = socketIo(server)
io.on('connection',(socket)=>{
   socket.join("Room-1")
   io.emit('roomjoin',rooms)
   socket.on('joined',({user}) =>{
      users[socket.id]=user
      socket.broadcast.emit('userJoined',{user:'Admin',message:`${users[socket.id]} has Joined`})
      socket.emit('welcome',mess)
      
   })
// console.log(mess);
   socket.on('message',({message,id})=>{
      const msg = {user:users[socket.id],message,id:id}
      io.emit('sendMessage',msg)
      mess.push(msg)
      console.log(msg);
   })

   socket.on('disconnected',()=>{
      socket.broadcast.emit('leave',{user:'Admin',message:`${users[socket.id]} has left`})
     
   })

})

const port = 4500 || process.env.PORT
server.listen(port, () => {
   console.log(`server is running on ${port}`);
})