const router = require("express").Router();
const doctor = require("../controllers/doctor.controller.js");

router.post("/", doctor.create);

module.exports = router;
