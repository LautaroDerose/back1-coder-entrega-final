import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/ecommerce'; // o la URI de Atlas

export const connectDB = async () => {
  console.log('🔌 Intentando conectar a MongoDB...');
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
  }
};
