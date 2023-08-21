const router = require("express").Router();

const appointment = require("../controllers/appointment.controller");
const { ROLES } = require("../helpers/constants");
const { verifyRoles } = require("../middleware/authorisation");
const { verifyJWT } = require("../middleware/authorisation");

// post a appointment
router.post("/", verifyJWT, verifyRoles([ROLES.DOCTOR]), appointment.create);

// get appointments
router.get("/", verifyJWT, verifyRoles([ROLES.DOCTOR]), appointment.list);

// get appointment by id
router.get("/:id", verifyJWT, verifyRoles([ROLES.DOCTOR]), appointment.retrievebyId);

// get appointment by slug
router.get("/slug/:slug", verifyJWT, verifyRoles([ROLES.DOCTOR]), appointment.retrieveBySlug);

// confirm or cancel by doctor
router.put("/:slug/status", verifyJWT, verifyRoles([ROLES.DOCTOR]), appointment.updateStatus);

// public confirm or cancel by patient
router.put("/public/:slug/status", appointment.updateStatusPublic);

// public get appointment detail NO ROLES!!!!
router.get("/public/:slug", appointment.detailsPublic);

module.exports = router;
