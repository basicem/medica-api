const patientServices = require("../services/patient.services");
const { patientSchema } = require("../schemas/patient");
const { patientVitalSchema } = require("../schemas/patient-vital");
const { medicationSchema } = require("../schemas/medication");
const { resolveError } = require("../helpers/controllers");
const { logger } = require("../logging/logger");

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
    logger.info(`Created patient with id=${patient.id}`);
    return res.status(201).json({ id: patient.id });
  } catch (err) {
    logger.error(`Error creating item: ${err.message}`);
    return resolveError(err, res);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.user;
    const data = await patientSchema.validateAsync({ ...req.body, doctorId: id });
    const patientParams = req.params;
    const patient = await patientServices.editPatient(patientParams.id, data);
    logger.info(`Updated patient with id=${patient.id}`);
    return res.status(200).json({ id: patient.id });
  } catch (err) {
    logger.error(`Error updating item: ${err.message}`);
    return resolveError(err, res);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await patientServices.deletePatient(id);
    logger.info(`Deleted patient with id=${id}`);
    return res.status(204).send();
  } catch (err) {
    logger.error(`Error deleting item: ${err.message}`);
    return resolveError(err, res);
  }
};

const addMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body, patientId: id };
    const value = await medicationSchema.validateAsync(data);
    const medication = await patientServices.addMedication(value);
    logger.info(`Added medication with id=${id} to patient with id=${medication.id}`);
    return res.status(201).json({ id: medication.id });
  } catch (err) {
    logger.error(`Error creating item: ${err.message}`);
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
    const { id } = req.params;
    const { medicationId } = req.params;
    const data = { ...req.body, patientId: id };
    const value = await medicationSchema.validateAsync(data);
    const medication = await patientServices.editMedication(value, medicationId);
    return res.status(201).json({ id: medication.id });
  } catch (err) {
    return resolveError(err, res);
  }
};

const addPatientVital = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body, patientId: id };
    const value = await patientVitalSchema.validateAsync(data);
    const vital = await patientServices.addPatientVital(value);
    logger.info(`Added vital with id=${vital.vitalId} to patient with id=${vital.patientId}`);
    return res.status(201).json({ id: vital.id });
  } catch (err) {
    logger.error(`Error creating item: ${err.message}`);
    return resolveError(err, res);
  }
};

const getPatientVitals = async (req, res) => {
  try {
    const { id } = req.params;
    const vitals = await patientServices.getAllPatientVitals({ patientId: id });
    return res.status(200).json(vitals);
  } catch (err) {
    return resolveError(err, res);
  }
};

const getPatientVitalHistory = async (req, res) => {
  try {
    const { id, vitalId } = req.params;
    const vitals = await patientServices.getPatientVitalHistory({
      ...req.query,
      patientId: id,
      vitalId
    });
    return res.status(200).json(vitals);
  } catch (err) {
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
  updateMedication,
  addPatientVital,
  getPatientVitals,
  getPatientVitalHistory
};
