const router = require("express").Router();

router.use("/api/auth", require("./auth.routes"));

router.use("/api/health-check", require("./health-check.routes"));

router.use("/api/patients", require("./patient.routes"));

router.use("/api/users", require("./user.routes"));

router.use("/api/appointments", require("./appointment.routes"));

module.exports = router;
