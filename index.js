const express = require('express');
const app  = express();
const mongoose = require('mongoose');
const server = require('http').createServer(app)
const io = require('socket.io')(server);
const fs = require('fs');
// const expressValidator = require('express-validator');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
// app.use(expressValidator());

//schema imports
const meetingSchema = require('./app/schema/meetingSchema');
const userSchema = require('./app/schema/userSchema');
const tokenScema = require('./app/schema/authTokenSchema');

//router imports
const adminMeeting = require('./app/routes/adminMeeting');
adminMeeting.setRouter(app);
const userMeeting = require('./app/routes/userMeeting');
userMeeting.setRouter(app);
const usermanagement = require('./app/routes/usermanagement');
usermanagement.setRouter(app);

server.listen(3000)
server.on('err',(err)=>{
    console.log('socket error',err);
})
server.on('listening',()=>{
    console.log('listening on port 3000');
    mongoose.connect('mongodb://127.0.0.1:27017/meeting',{ useCreateIndex: true, useNewUrlParser: true })
    .then((success)=>{
        // console.log(success);
        console.log('connected to db')
    })
    .catch((err)=>{
        console.log(err);
    })
})
const sock = require('./app/notifications/realtime');
const socketServer  = sock.setServer(server);

/* app.listen(3000,()=>{
    console.log('listening on port 3000');
    mongoose.connect('mongodb://127.0.0.1:27017/meeting',{ useCreateIndex: true, useNewUrlParser: true })
    .then((success)=>{
        // console.log(success);
        console.log('connected to db')
    })
    .catch((err)=>{
        console.log(err);
    })
});
 */
module.exports = {
    app
}