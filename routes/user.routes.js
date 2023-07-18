const router = require("express").Router();
const user = require("../controllers/user.controller");
const ROLES = require("../helpers/constants");
const { verifyRoles } = require("../middleware/authorisation");

router.get("/", verifyRoles(ROLES.ADMIN), user.list);

router.post("/", verifyRoles(ROLES.ADMIN), user.create);

router.put("/:id", verifyRoles(ROLES.ADMIN), user.update);

module.exports = router;
