require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectWithRetry } = require('./config/db');
const iphonesRouter = require('./routes/iphones');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/iphones', iphonesRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const start = async () => {
  await connectWithRetry();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

start();