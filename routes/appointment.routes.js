const router = require("express").Router();

const appointment = require("../controllers/appointment.controller");
const ROLES = require("../helpers/constants");
const { verifyRoles } = require("../middleware/authorisation");

router.post("/", verifyRoles(ROLES.DOCTOR), appointment.create);

router.get("/", verifyRoles(ROLES.DOCTOR), appointment.list);

router.get("/:slug", verifyRoles(ROLES.DOCTOR), appointment.retrieveBySlug);

router.get("/:id", verifyRoles(ROLES.DOCTOR), appointment.retrievebyId);

module.exports = router;
