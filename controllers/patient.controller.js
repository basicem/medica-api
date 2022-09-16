const patientServices = require("../services/patient.services");
const { MedicaError } = require("../exceptions");

const get = async (req, res) => {
  try {
    const patients = await patientServices.getAllPatients(req.query);
    return res.status(200).json(patients);
  } catch (err) {
    if (err instanceof MedicaError) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const post = async (req, res) => {
  try {
    const patient = await patientServices.createPatient(req.body);
    return res.status(201).json({ id: patient.id });
  } catch (err) {
    if (err instanceof MedicaError) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { post, get };
