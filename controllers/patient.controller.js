const patientServices = require("../services/patient.services");
const { patientSchema } = require("../schemas/patient");
const { resolveError } = require("../helpers/pagination");

const get = async (req, res) => {
  try {
    const patients = await patientServices.getAllPatients(req.query);
    return res.status(200).json(patients);
  } catch (err) {
    return resolveError(err, res);
  }
};

const post = async (req, res) => {
  try {
    const value = await patientSchema.validateAsync(req.body);
    const patient = await patientServices.createPatient(value);
    return res.status(201).json({ id: patient.id });
  } catch (err) {
    return resolveError(err, res);
  }
};

module.exports = { post, get };
