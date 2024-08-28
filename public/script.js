const socket = io('/')
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3002'
})

// handle when we connected to the peer server and get back an id
myPeer.on('open', id => {
    // call join_room socket io event in the server
    socket.emit('join-room', ROOM_ID, id)
})

const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
// mute our own mic so no loopback
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    // add our own video
    addVideoStream(myVideo, stream)
    // send stream when someone try to call (receive call)
    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    // allow to be connected to by other user
    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

// (make call to new join user)
function connectToNewUser(userId, stream){
    // call user with that userId and send our stream
    const call = myPeer.call(userId, stream)
    // new video element
    const video = document.createElement('video')

    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })
}

function addVideoStream (video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}