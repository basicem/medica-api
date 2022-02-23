const router = require("express").Router();
const doctor = require("../controllers/doctor.controller");

router.post("/", doctor.create);

module.exports = router;
