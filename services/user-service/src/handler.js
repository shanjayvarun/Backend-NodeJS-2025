const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);

app.get('/health', (_, res) => {
  res.status(200).json({ status: true, message: 'User service is running' });
});

module.exports = app;
