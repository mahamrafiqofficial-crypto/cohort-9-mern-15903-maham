require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const cors = require('cors');
const pinoHttp = require('pino-http');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();

app.use(cors({
  origin: 'https://notes-by-maham.vercel.app',
  credentials: true,
}));
app.use(express.json());
app.use(pinoHttp({ logger }));

// --- Serverless-friendly MongoDB connection ---
let conn = null;

const connectDB = async () => {
  if (conn && mongoose.connection.readyState === 1) {
    return conn;
  }
  try {
    conn = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    logger.info('MongoDB connected');
    return conn;
  } catch (err) {
    conn = null;
    logger.error({ err: err.message }, 'MongoDB connection error');
    throw err;
  }
};

app.use(async (req, res, next) => {
  if (req.path === '/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      detail: err.message,
    });
  }
});
// --- End DB connection block ---

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  });
}

module.exports = app;