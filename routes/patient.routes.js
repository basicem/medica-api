const router = require("express").Router();
const patient = require("../controllers/patient.controller");

router.get("/", patient.list);

router.get("/:slug", patient.retrieve);

router.post("/", patient.create);

router.put("/:id", patient.update);

router.delete("/:id", patient.remove);

module.exports = router;
