const router = require("express").Router();

router.use("/api/health-check", require("./health-check.routes"));

router.use("/api/doctor-post", require("./doctor.routes"));

module.exports = router;
