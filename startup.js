const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ status: 'Prvi prolaz :)' });
});

require('./app/routes/health-check.routes')(app);

app.listen(port);
