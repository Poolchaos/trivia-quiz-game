import mongoose from 'mongoose';
import { MONGODB_URI } from '@/utils/env';

const connection = { isConnected: false };

async function connectToDatabase() {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    connection.isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to database');
  }
}

async function disconnectFromDatabase() {
  if (!connection.isConnected) {
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    await mongoose.disconnect();
    connection.isConnected = false;
  }
}

export { connectToDatabase, disconnectFromDatabase };