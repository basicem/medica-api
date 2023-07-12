const router = require("express").Router();
const patient = require("../controllers/patient.controller");
const ROLES_LIST = require("../helpers/roles");
const { verifyRoles } = require("../middleware/verifyJWT");

router.get("/", verifyRoles(ROLES_LIST.Doctor), patient.list);

router.get("/:slug", verifyRoles(ROLES_LIST.Doctor), patient.retrieve);

router.post("/", verifyRoles(ROLES_LIST.Doctor), patient.create);

router.put("/:id", verifyRoles(ROLES_LIST.Doctor), patient.update);

router.delete("/:id", verifyRoles(ROLES_LIST.Doctor), patient.remove);

module.exports = router;
