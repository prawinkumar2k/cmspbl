/**
 * MongoDB Connection - Production Grade
 * Replaces mysql2/promise pool
 */

import mongoose from 'mongoose';
import logger from '../lib/logger.js';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    logger.info('MongoDB already connected');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,  // Fail fast if server unreachable
      socketTimeoutMS: 45000,
      maxPoolSize: 100,                 // Match your old MySQL pool size
      minPoolSize: 5,
      connectTimeoutMS: 10000,
    });

    isConnected = true;

    logger.info('✅ MongoDB Connected', {
      host: conn.connection.host,
      database: conn.connection.name,
      port: conn.connection.port,
    });

  } catch (error) {
    logger.error('❌ MongoDB connection failed', { error: error.message });
    process.exit(1);
  }
};

// Monitor connection events
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to MongoDB');
  isConnected = true;
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected from MongoDB');
  isConnected = false;
});

mongoose.connection.on('reconnected', () => {
  logger.info('Mongoose reconnected to MongoDB');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error', { error: err.message });
  isConnected = false;
});

export default connectDB;
