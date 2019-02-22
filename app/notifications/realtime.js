const mongoose = require('mongoose');
const socketio = require('socket.io');
const token = require('./../library/jwt');
const id = require('short-id');

let setServer = (server)=>{

    let  io = socketio.listen(server);
    let myio = io.of('/')
    myio.on('connect',(socket)=>{
        console.log("on connection,emmiting verify user");
        socket.emit('verify',"");
        
        socket.on('set-user',(token)=>{
            console.log(token);
        })
    })

}

module.exports = {
    setServer
}