const router = require("express").Router();
const patient = require("../controllers/patient.controller");

router.get("/", patient.get);

router.post("/", patient.post);

module.exports = router;
