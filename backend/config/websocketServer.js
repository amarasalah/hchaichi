const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 5000 });

server.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      // Handle the message
    } catch (error) {
      console.error('Received non-JSON data:', data);
    }
  });
  

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:5000');
