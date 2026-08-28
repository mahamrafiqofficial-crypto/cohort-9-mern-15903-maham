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
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error({ err }, 'MongoDB connection error');
    throw err;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
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