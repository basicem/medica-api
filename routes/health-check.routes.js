const router = require("express").Router();
const healthCheck = require("../controllers/health-check.controller");

router.get("/", healthCheck.status);

module.exports = router;
