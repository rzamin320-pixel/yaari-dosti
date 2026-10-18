const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/matches');
const messageRoutes = require('./routes/messages');
const paymentRoutes = require('./routes/payments');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);

io.on('connection', socket => {
  socket.on('joinRoom', ({ room }) => socket.join(room));
  socket.on('sendMessage', ({ room, message }) => {
    io.to(room).emit('receiveMessage', message);
  });
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yaari-dosti';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Mongo connected');
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection failed:', err);
    process.exit(1);
  });
