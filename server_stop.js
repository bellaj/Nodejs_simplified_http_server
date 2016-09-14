console.log("server stoped");
var io = require('socket.io-client');
var socketClient = io.connect('http://127.0.0.1:8888'); 

socketClient.on('connect', () => {
  socketClient.emit('npmStop');
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});
