const router = require("express").Router();

const appointment = require("../controllers/appointment.controller");
const ROLES = require("../helpers/constants");
const { verifyRoles } = require("../middleware/authorisation");

router.post("/", verifyRoles(ROLES.DOCTOR), appointment.create);

module.exports = router;
