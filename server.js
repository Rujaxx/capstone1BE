const express = require('express');
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
const path = require('path')


//Load env vars
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'})


app.use(express.static('public'));

//socket.io emit connections

io.on('connection', (socket) => {
    console.log('A user just connected.');
    socket.on('disconnect', () => {
        console.log('A user has disconnected.');
    })
    //start button
    socket.on('startGame', () => {
        io.emit('startGame');
    })
    //crazy button takes in data from crazy button and emits it back to the app js
    socket.on('crazyIsClicked', (data) => {
        io.emit('crazyIsClicked', data);
    });
});





server.on('error', (err)=>{
    console.error(err);
})


//DEV logging Middleware 
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// };



const PORT = process.env.PORT || 3000;

server.listen(PORT,() => {console.log(`Server is listening on ${PORT}`)})