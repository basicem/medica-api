const appointmentService = require("../services/appointment.services");
const authService = require("../services/auth.services");
const { appointmentSchema } = require("../schemas/appointment");
const { resolveError } = require("../helpers/controllers");

const create = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(" ")[1];
    const { id } = await authService.verifyToken(token);
    const data = { ...req.body, doctorId: id };
    const value = await appointmentSchema.validateAsync(data);
    const appointment = await appointmentService.createAppointment(value);
    return res.status(201).json(appointment);
  } catch (err) {
    return resolveError(err, res);
  }
};

const list = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(" ")[1];
    const { id } = await authService.verifyToken(token);
    const appointments = await appointmentService.getAppointmentsByDoctor(id, req.query);
    return res.status(200).json(appointments);
  } catch (err) {
    return resolveError(err, res);
  }
};

const retrieveBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const appointment = await appointmentService.getAppointmentBySlug(slug);
    return res.status(200).json(appointment);
  } catch (err) {
    return resolveError(err, res);
  }
};

const retrievebyId = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentById(id);
    return res.status(200).json(appointment);
  } catch (err) {
    return resolveError(err, res);
  }
};

module.exports = {
  create, list, retrieveBySlug, retrievebyId
};
