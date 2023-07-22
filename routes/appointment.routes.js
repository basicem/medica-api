const router = require("express").Router();

const appointment = require("../controllers/appointment.controller");
const ROLES = require("../helpers/constants");
const { verifyRoles } = require("../middleware/authorisation");

router.post("/", verifyRoles(ROLES.DOCTOR), appointment.create);

router.get("/doctor/:id", verifyRoles(ROLES.DOCTOR), appointment.list);

router.get("/:slug", verifyRoles(ROLES.DOCTOR), appointment.retrieve);

router.get("/:id", verifyRoles(ROLES.DOCTOR), appointment.retrieve);

module.exports = router;
