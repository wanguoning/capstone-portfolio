// app.js
// Express application: security middleware, CORS, body parsing, routes,
// 404 handler and the central error middleware. Separated from the server
// entry point so the app can be loaded for automated testing.

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const blogRoutes = require('./routes/blogRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorMiddleware } = require('./middleware/errorMiddleware');

const app = express();

// Secure HTTP headers
app.use(helmet());

// CORS: allow the configured origin plus the local Vite dev server
const allowedOrigins = [process.env.CORS_ORIGIN, 'http://localhost:5173'].filter(
  Boolean
);
app.use(cors({ origin: allowedOrigins }));

// Parse JSON request bodies and read cookies
app.use(express.json());
app.use(cookieParser());

// Mount API routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', messageRoutes);

// 404 for unmatched routes, then the central error handler
app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
