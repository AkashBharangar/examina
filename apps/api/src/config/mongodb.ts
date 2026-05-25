import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:password@localhost:27017/examina?authSource=admin';

export async function connectMongoDB(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    throw error;
  }
}

export function disconnectMongoDB(): Promise<void> {
  return mongoose.disconnect();
}
