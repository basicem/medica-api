const patientServices = require("../services/patient.services");
const { patientSchema } = require("../schemas/patient");
const { medicationSchema } = require("../schemas/medication");
const { resolveError } = require("../helpers/controllers");

const list = async (req, res) => {
  try {
    const { id } = req.user;
    const data = { ...req.query, doctorId: id };
    const patients = await patientServices.getAllPatients(data);
    return res.status(200).json(patients);
  } catch (err) {
    return resolveError(err, res);
  }
};

const search = async (req, res) => {
  try {
    const { id } = req.user;
    const data = { ...req.query, doctorId: id };
    const patients = await patientServices.searchPatients(data);
    return res.status(200).json(patients);
  } catch (err) {
    return resolveError(err, res);
  }
};

const listByDoctor = async (req, res) => {
  try {
    const patients = await patientServices.getAllPatientsByDoctor(req.query);
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
    const { id } = req.user;
    const data = { ...req.body, doctorId: id };
    const value = await patientSchema.validateAsync(data);
    const patient = await patientServices.createPatient(value);
    return res.status(201).json({ id: patient.id });
  } catch (err) {
    return resolveError(err, res);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.user;
    const data = await patientSchema.validateAsync({ ...req.body, doctorId: id });
    const patientParams = req.params;
    const patient = await patientServices.editPatient(patientParams.id, data);
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

const addMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body, patientId: id };
    const value = await medicationSchema.validateAsync(data);
    const medication = await patientServices.addMedication(value);
    return res.status(201).json({ id: medication.id });
  } catch (err) {
    return resolveError(err, res);
  }
};

const getAllMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const medications = await patientServices.getAllMedication({ ...req.query, patientId: id });
    return res.status(200).json(medications);
  } catch (err) {
    return resolveError(err, res);
  }
};

const deleteMedication = async (req, res) => {
  try {
    const { medicationId } = req.params;
    await patientServices.deleteMedication(medicationId);
    return res.status(204).send();
  } catch (err) {
    return resolveError(err, res);
  }
};

const updateMedication = async (req, res) => {
  try {
    console.log("Hi");
    const { id } = req.params;
    const { medicationId } = req.params;
    const data = { ...req.body, patientId: id };
    const value = await medicationSchema.validateAsync(data);
    const medication = await patientServices.editMedication(value, medicationId);
    return res.status(201).json({ id: medication.id });
  } catch (err) {
    console.log("Error is ", err);
    return resolveError(err, res);
  }
};

module.exports = {
  create,
  get,
  list,
  listByDoctor,
  retrieve,
  remove,
  update,
  search,
  addMedication,
  getAllMedication,
  deleteMedication,
  updateMedication
};
