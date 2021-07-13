const app = require('express')();
const http = require('http').createServer(app);
//const io = require('socket.io')(http, { transport : ['websocket'] });
const io = require('socket.io')(http, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true
    }
  });
const cors = require('cors');


app.use(cors());

// defing the web-socket server
io.on('connection', (socket)=>{
    console.log('User is online');

    socket.on('canvas-data', (data)=>{
        socket.broadcast.emit('canvas-data', data);
    })
})


// defing the server_port
var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, ()=>{
    console.log('Server running on port: ',server_port);
})