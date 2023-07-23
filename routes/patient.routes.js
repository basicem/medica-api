const router = require("express").Router();
const patient = require("../controllers/patient.controller");
const ROLES = require("../helpers/constants");
const { verifyRoles } = require("../middleware/authorisation");

router.get("/", verifyRoles(ROLES.DOCTOR), patient.list);

router.get("/search", verifyRoles(ROLES.DOCTOR), patient.search);

router.get("/:id", verifyRoles(ROLES.DOCTOR), patient.get);

router.get("/slug/:slug", verifyRoles(ROLES.DOCTOR), patient.retrieve);

router.post("/", verifyRoles(ROLES.DOCTOR), patient.create);

router.put("/:id", verifyRoles(ROLES.DOCTOR), patient.update);

router.delete("/:id", verifyRoles(ROLES.DOCTOR), patient.remove);

module.exports = router;
