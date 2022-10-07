const router = require("express").Router();
const patient = require("../controllers/patient.controller");

router.get("/", patient.get);

router.get("/:slug", patient.getPatient);

router.post("/", patient.post);

router.put("/", patient.put);

router.delete("/:slug", patient.deletePatient);

module.exports = router;
