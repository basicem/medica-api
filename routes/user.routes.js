const router = require("express").Router();
const user = require("../controllers/user.controller");
const ROLES_LIST = require("../helpers/roles");
const { verifyRoles } = require("../middleware/verifyJWT");

router.get("/", verifyRoles(ROLES_LIST.Admin), user.list);

router.post("/", verifyRoles(ROLES_LIST.Admin), user.create);

router.put("/:id", verifyRoles(ROLES_LIST.Admin), user.update);

module.exports = router;
