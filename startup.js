const express = require("express");

const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.json({ status: "startup.js" });
});

app.use(require("./routes"));

app.listen(port);
