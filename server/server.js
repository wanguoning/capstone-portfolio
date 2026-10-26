// server.js
// Entry point: load environment variables, connect to MongoDB and start the
// Express server.

require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Connect to the database before listening on the port
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
