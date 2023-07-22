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
    const { slug } = req.params;
    const patient = await patientServices.getPatientBySlug(slug);
    return res.status(200).json(patient);
  } catch (err) {
    return resolveError(err, res);
  }
};

const get = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await patientServices.getPatientById(id);
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
    const data = await patientSchema.validateAsync(req.body);
    const { id } = req.params;
    const patient = await patientServices.editPatient(id, data);
    return res.status(200).json({ id: patient.id });
  } catch (err) {
    return resolveError(err, res);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await patientServices.deletePatient(id);
    return res.status(204).send();
  } catch (err) {
    return resolveError(err, res);
  }
};

module.exports = {
  create, get, list, retrieve, remove, update
};
