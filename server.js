require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const isProduction = process.env.NODE_ENV === 'production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://bionicstripes.cloud';

// CORS
if (isProduction) {
  app.use(cors({ origin: FRONTEND_URL, credentials: true }));
} else {
  app.use(cors({ origin: FRONTEND_URL, credentials: true }));
}

app.use(express.json());

// Parse string body fallback
app.use((req, res, next) => {
  if (typeof req.body === 'string') {
    try { req.body = JSON.parse(req.body); } catch (e) {}
  }
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const movieRoutes = require('./routes/movieRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/movies', movieRoutes);

// Serve static frontend files in production
if (isProduction) {
  const frontendPath = path.join(__dirname, 'client', 'dist');
  app.use(express.static(frontendPath));
  
  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
