const express = require('express');

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.json({ status: 'Prvi prolaz :)' });
});

app.use(require('./app/routes'));

app.listen(port);
