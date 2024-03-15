const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let scores = []; // Aquí mantendrías los marcadores actualizados

app.get('/', (req, res) => {
  res.send('Servidor de marcadores en vivo');
});

io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado');
  socket.emit('scoreUpdate', scores);

  socket.on('updateScore', (updatedScore) => {
    // Actualiza los marcadores y retransmite a todos los clientes
    scores = updateScoresArray(scores, updatedScore);
    io.emit('scoreUpdate', scores);
  });

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado');
  });
});

function updateScoresArray(scores, updatedScore) {
  const index = scores.findIndex(score => score.name === updatedScore.name);
  if (index > -1) {
    scores[index] = updatedScore;
  } else {
    scores.push(updatedScore);
  }
  return scores;
}

// Define el puerto desde el entorno o utiliza 3000 por defecto
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

