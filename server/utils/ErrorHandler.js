// utils/ErrorHandler.js
// Custom error class that carries an HTTP status code so the global
// error middleware can return a proper JSON response.

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorHandler;
