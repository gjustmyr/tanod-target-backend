require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, sequelize } = require('./db');
const authRouter = require('./routes/auth');
const inventoryRouter = require('./routes/inventory');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => res.json({ message: 'pong' }));
app.use('/api/auth', authRouter);
app.use('/api/inventory', inventoryRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

const start = async () => {
  await connectDB();
  await sequelize.sync({ alter: false });
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
};

if (require.main === module) {
  start().catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });
}

module.exports = app;

