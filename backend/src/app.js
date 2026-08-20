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
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(notFoundHandler);   
app.use(errorHandler);       

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error({ err }, 'MongoDB connection error');
    process.exit(1);
  });