const router = require("express").Router();
const { verifyJWT } = require("../middleware/verifyJWT");

router.use("/api", require("./auth.routes"));

router.use("/api/health-check", require("./health-check.routes"));

router.use(verifyJWT);
router.use("/api/patients", require("./patient.routes"));

router.use("/api/users", require("./user.routes"));

module.exports = router;
