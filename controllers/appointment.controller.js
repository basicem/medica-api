const appointmentService = require("../services/appointment.services");
const { appointmentSchema } = require("../schemas/appointment");
const { resolveError } = require("../helpers/controllers");

const create = async (req, res) => {
  try {
    const value = await appointmentSchema.validateAsync(req.body);
    const appointment = await appointmentService.createAppointment(value);
    return res.status(201).json(appointment);
  } catch (err) {
    return resolveError(err, res);
  }
};

const list = async (req, res) => {
  try {
    const { id } = req.params;
    const appointments = await appointmentService.getAppointmentsByDoctorId(id);
    return res.status(200).json(appointments);
  } catch (err) {
    return resolveError(err, res);
  }
};

const retrieve = async (req, res) => {
  try {
    const { slug } = req.params;
    const appointment = await appointmentService.getAppointment(slug);
    return res.status(200).json(appointment);
  } catch (err) {
    return resolveError(err, res);
  }
};

module.exports = {
  create, list, retrieve
};
