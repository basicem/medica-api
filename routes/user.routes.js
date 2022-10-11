const router = require("express").Router();
const user = require("../controllers/user.controller");

router.get("/", user.list);

router.post("/", user.create);

router.put("/:id", user.update);

module.exports = router;
