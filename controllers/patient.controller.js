const patientServices = require("../services/patient.services");
const { patientSchema } = require("../schemas/patient");
const { resolveError } = require("../helpers/controllers");

const list = async (req, res) => {
  try {
    const patients = await patientServices.getAllPatients(req.query);
    return res.status(200).json(patients);
  } catch (err) {
    return resolveError(err, res);
  }
};

const retrieve = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await patientServices.getPatient({ id });
    return res.status(200).json(patient);
  } catch (err) {
    return resolveError(err, res);
  }
};

const create = async (req, res) => {
  try {
    const value = await patientSchema.validateAsync(req.body);
    const patient = await patientServices.createPatient(value);
    return res.status(201).json({ id: patient.id });
  } catch (err) {
    return resolveError(err, res);
  }
};

const update = async (req, res) => {
  try {
    const { data } = req.params;
    const value = await patientSchema.validateAsync(data);
    const patient = await patientServices.editPatient(value);
    return res.status(200).json({ id: patient.id });
  } catch (err) {
    return resolveError(err, res);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const num = await patientServices.deletePatient({ id });
    return res.status(200).json({ num });
  } catch (err) {
    return resolveError(err, res);
  }
};

module.exports = {
  create, list, retrieve, remove, update
};
