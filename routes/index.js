const { route } = require("./health-check.routes");

const router = require("express").Router();

router.use("/api/health-check", require("./health-check.routes"));

router.use("/api/doctors", require("./doctor.routes"));

router.use("/api/patients", require("./patient.routes"));

module.exports = router;
