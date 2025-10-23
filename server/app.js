require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./src/routes/authRoutes');
const fileRoutes = require('./src/routes/fileRoutes');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/', authRoutes);
app.use('/', fileRoutes);

app.get('/api/test', async (req, res) => {

  res.send('Hello World!');

});

const PORT = process.env.PORT || 8080;

if (process.env.ENVIRONMENT == 'development') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
