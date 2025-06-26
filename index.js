require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const contactRoutes = require('./routes/contactRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiryRoutes);
// app.use('/api/contacts', contactRoutes);

// Apply CORS only for email routes
// const corsOptions = {
//   origin: function (origin, callback) {
//     const allowedOrigins = process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim());
//     const isAllowed = !origin || allowedOrigins.some(allowed => {
//       return origin.startsWith(allowed) || allowed.startsWith(origin);
//     });
    
//     if (isAllowed) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS not allowed'));
//     }
//   },
//   methods: ['POST'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 200
// };

app.use('/api/email', emailRoutes);

// Test route
app.get('/test', (req, res) => {
  res.send('This is a test route');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});