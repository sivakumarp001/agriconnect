import mongoose from 'mongoose';

let cachedConnection = null;

export const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState >= 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error('Neither MONGODB_URI nor MONGO_URI is defined in environment variables.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      bufferCommands: false
    });
    cachedConnection = conn;
    console.log('MongoDB connected');
    return conn;
  } catch (error) {
    console.error('MongoDB error:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      // In dev or seed scripts, don't necessarily hard crash if already handled
    }
    throw error;
  }
};
