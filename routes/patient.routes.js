const router = require("express").Router();
const patient = require("../controllers/patient.controller");
const { ROLES } = require("../helpers/constants");
const { verifyJWT } = require("../middleware/authorisation");
const { verifyRoles } = require("../middleware/authorisation");

// add medication to patient

router.post("/medication", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.addMedication);

// get medication for patient

router.get("/medication", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.getAllMedication);

router.get("/", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.list);

router.get("/search", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.search);

router.get("/:id", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.get);

router.get("/slug/:slug", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.retrieve);

router.post("/", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.create);

router.put("/:id", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.update);

router.delete("/:id", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.remove);

module.exports = router;
