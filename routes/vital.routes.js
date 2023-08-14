const router = require("express").Router();
const vital = require("../controllers/vital.controller");
const { ROLES } = require("../helpers/constants");
const { verifyRoles } = require("../middleware/authorisation");
const { verifyJWT } = require("../middleware/authorisation");

router.get("/", verifyJWT, verifyRoles(ROLES.ADMIN), vital.list);

router.post("/", verifyJWT, verifyRoles(ROLES.ADMIN), vital.create);

module.exports = router;
