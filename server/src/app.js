const path = require('path');
const colors = require('colors');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/error');

const { p2pServer } = require('./local/local-copy');
//MongoDB database to store user profiles (and keys in the demo, encrypted)
if (!process.env.PEER) {
  const connectDB = require('../config/db.js');

  connectDB();
}

//Route files
const walletRoutes = require('./routes/wallet');
const p2pRoutes = require('./routes/p2p');
const authRoutes = require('./routes/auth');

//Express.js
const app = express();
app.use(cors()); //TODO: figure out if and how to use whitelisting
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/../../client/public')));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(cookieParser());

app.use('/api/v0/wallet', walletRoutes);
app.use('/api/v0/p2p', p2pRoutes);
app.use('/api/v0/auth', authRoutes);

const HTTP_PORT = process.env.HTTP_PORT || 3001;

if (process.env.NODE_ENV === 'production') {
  console.log(process.env.NODE_ENV);
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../public/index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../../client/public/index.html'));
  });
}

app.use(errorHandler);

//listening to servers

app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`.yellow);
});

p2pServer.listen();
