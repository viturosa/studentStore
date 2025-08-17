import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import Product from './models/Product.js';

dotenv.config();

const server = http.createServer(app);
const io = new Server(server);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch((err) => console.error('Erro de conexão ao MongoDB:', err));


io.on('connection', (socket) => {
  console.log('Cliente conectado');

  Product.find().then(products => socket.emit('productsUpdated', products));


});


app.set('io', io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));