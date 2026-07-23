require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');


const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/health', (req,res)=> res.json({ status: 'ok' }));

mongoose.connect(process.env.MONGODB_URI)
 .then(() => console.log('MongoDB connected'))
 .catch((err)=> console.error('MongoDB error:' , err));

 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));