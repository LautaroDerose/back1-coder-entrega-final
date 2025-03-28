import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://laudero:Arcano87@cluster0.aun06fn.mongodb.net/trabajofinal?retryWrites=true&w=majority&appName=Cluster0'; 

export const connectDB = async () => {
  console.log('Intentando conectar a MongoDB...');
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
  }
};
