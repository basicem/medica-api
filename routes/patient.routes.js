const router = require("express").Router();
const patient = require("../controllers/patient.controller");
const { ROLES } = require("../helpers/constants");
const { verifyJWT, verifyRoles } = require("../middleware/authorisation");
const { checkPermission } = require("../middleware/permission");
const { hasPatientPermission } = require("../permissions/doctors.permissions");

// add medication to patient

router.post("/:id/medications", verifyJWT, verifyRoles(ROLES.DOCTOR), checkPermission(hasPatientPermission), patient.addMedication);

// delete medication to patient

router.delete("/:id/medications/:medicationId", verifyJWT, verifyRoles(ROLES.DOCTOR), checkPermission(hasPatientPermission), patient.deleteMedication);

// update medication by id

router.put("/:id/medications/:medicationId", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.updateMedication);
// get medication for patient

router.get("/:id/medications", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.getAllMedication);

// get all patients

router.get("/", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.list);

// search pateints (auto complete)

router.get("/search", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.search);

// get patient by id

router.get("/:id", verifyJWT, verifyRoles(ROLES.DOCTOR), checkPermission(hasPatientPermission), patient.get);

// get patient by slug

router.get("/slug/:slug", verifyJWT, verifyRoles(ROLES.DOCTOR), checkPermission(hasPatientPermission), patient.retrieve);

// post a patient

router.post("/", verifyJWT, verifyRoles(ROLES.DOCTOR), patient.create);

// update the patient by id

router.put("/:id", verifyJWT, verifyRoles(ROLES.DOCTOR), checkPermission(hasPatientPermission), patient.update);

// delete the patient by id

router.delete("/:id", verifyJWT, verifyRoles(ROLES.DOCTOR), checkPermission(hasPatientPermission), patient.remove);

module.exports = router;
