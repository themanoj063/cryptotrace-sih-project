/**
 * CryptoTrace Database Connection Client
 * Manages Mongoose ODM connection to MongoDB
 * Uses backend's Mongoose instance to avoid dual-instance connection buffering
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

// Use backend's mongoose to guarantee singleton model connection
let mongoose;
try {
  mongoose = require('../backend/node_modules/mongoose');
} catch (e) {
  mongoose = require('mongoose');
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cryptotrace';

async function getDatabaseConnection() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  
  mongoose.set('strictQuery', false);
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });

  return mongoose.connection;
}

module.exports = {
  getDatabaseConnection,
  MONGODB_URI,
  mongoose
};
