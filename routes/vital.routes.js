const router = require("express").Router();
const vital = require("../controllers/vital.controller");
const { ROLES } = require("../helpers/constants");
const { verifyRoles } = require("../middleware/authorisation");
const { verifyJWT } = require("../middleware/authorisation");

router.get("/", verifyJWT, verifyRoles([ROLES.ADMIN, ROLES.DOCTOR]), vital.list);

router.post("/", verifyJWT, verifyRoles([ROLES.ADMIN]), vital.create);

router.put("/:id", verifyJWT, verifyRoles([ROLES.ADMIN]), vital.update);

module.exports = router;
