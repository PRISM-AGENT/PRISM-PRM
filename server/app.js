/**
 * 🖥️ PRISM Application Server
 * Main Express application setup
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const { error } = require('./middleware');

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));

// Logging middleware
app.use(morgan(config.logFormat));

// API routes
app.use('/api', routes);

// Serve static assets in production
if (config.nodeEnv === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Any route not matched by API will serve the React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// 404 handler for API routes
app.use('/api/*', error.notFound);

// Error handling middleware
app.use(error.errorHandler);

// Connect to MongoDB if not in test mode
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('MongoDB Connected');
      
      // Start server (only if not imported for testing)
      if (require.main === module) {
        app.listen(config.port, () => {
          console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
        });
      }
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
}

module.exports = app; 