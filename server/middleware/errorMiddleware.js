// middleware/errorMiddleware.js
// Central 404 handler for unmatched routes and a global error handler that
// converts thrown / Mongoose errors into a consistent JSON response.

// 404 handler for any route that was not matched
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

// Global error handler: maps common Mongoose errors to proper status codes
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Invalid ObjectId (CastError) -> 404 resource not found
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }
  // Duplicate unique key (error code 11000) -> friendly 400
  else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${field} already exists`;
  }
  // Mongoose validation error -> 400 with all validation messages collected
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorMiddleware };
