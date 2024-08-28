// create express
const express = require('express')
// call express
const app = express()
// create express server
const server = require('http').Server(app)
// bending/? server with socket.io
const io = require('socket.io')(server)
// call uuid function
const {v4 : uuidV4} = require('uuid')

// using ejs for rendering views
app.set('view engine', 'ejs')
// put html css files in public folder
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId : req.params.room})
})

// handle when user get into the room
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        // joining the socket into room with that roomid
        socket.join(roomId)
        // broadcasting into other user cuz we (us) need to setup video connection
        socket.to(roomId).emit('user-connected', userId)

    })
})

server.listen(3001)

