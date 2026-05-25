import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:password@localhost:27017/examina?authSource=admin';

export async function connectMongoDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(MONGODB_URI);
  console.log('✓ MongoDB connected');
}

export async function disconnectMongoDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
