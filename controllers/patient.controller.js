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

const getPatient = async (req, res) => {
  try {
    const patient = await patientServices.getPatient(req.params);
    return res.status(200).json(patient);
  } catch (err) {
    console.log(err);
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

const put = async (req, res) => {
  try {
    // const value = await patientSchema.validateAsync(req.body);
    const patient = await patientServices.editPatient(req.body);
    return res.status(201).json({ id: patient.id });
  } catch (err) {
    return resolveError(err, res);
  }
};

const deletePatient = async (req, res) => {
  try {
    const num = await patientServices.deletePatient(req.params);
    return res.status(200).json({ num });
  } catch (err) {
    return resolveError(err, res);
  }
};

module.exports = {
  post, get, getPatient, deletePatient, put
};
