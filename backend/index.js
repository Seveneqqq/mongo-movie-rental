const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

app.get('/api', (req, res) => {   // usunięte '/api'
  res.send('<h1>hello</h1>');
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('hello from backend');