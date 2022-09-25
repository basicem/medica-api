const express = require("express");

const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());

app.use(bodyParser.json({ limit: "5mb" }));

app.use(require("./routes"));

app.listen(port);

module.exports = { app };
