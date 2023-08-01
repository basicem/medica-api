const router = require("express").Router();
const user = require("../controllers/user.controller");
const { ROLES } = require("../helpers/constants");
const { verifyRoles } = require("../middleware/authorisation");
const { verifyJWT } = require("../middleware/authorisation");

router.get("/", verifyJWT, verifyRoles(ROLES.ADMIN), user.list);

router.post("/", verifyJWT, verifyRoles(ROLES.ADMIN), user.create);

router.put("/:id", verifyJWT, verifyRoles(ROLES.ADMIN), user.update);

module.exports = router;
