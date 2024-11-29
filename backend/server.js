const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5002;

// Import models
const User = require('./models/user');
const Blog = require('./models/blog');
const PractitionerProfile = require('./models/practitionerProfile');

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const appointmentRoutes = require('./routes/appointments');
const practitionerRoutes = require('./routes/practitioners');

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  next();
});

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/practitioners', practitionerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    console.log('Available routes:');
    app._router.stack.forEach(r => {
      if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
      }
    });
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});
