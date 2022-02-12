const express = require('express');

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello :)');
});

app.listen(port);
