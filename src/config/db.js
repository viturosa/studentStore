import mongoose from 'mongoose';

export default async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI não definido.');
  await mongoose.connect(uri, {
    autoIndex: true,
  });
  console.log('MongoDB conectado');
}