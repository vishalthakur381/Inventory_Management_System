const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const seedData = require('./config/seed');
const { errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Inventory Management System API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middleware
app.use(errorHandler);

// MongoDB Connection & Server Launch
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/inventory';

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedData();
  })
  .catch((err) => {
    console.warn('MongoDB connection notice: Running in decoupled mode until DB is reachable.', err.message);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
