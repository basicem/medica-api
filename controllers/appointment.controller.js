const sendEmail = require("../helpers/email");
const appointmentService = require("../services/appointment.services");
const patientServices = require("../services/patient.services");
const { appointmentSchema } = require("../schemas/appointment");
const { resolveError } = require("../helpers/controllers");

const { logger } = require("../logging/logger");

const create = async (req, res) => {
  try {
    const { id } = req.user;
    const data = { ...req.body, doctorId: id };
    const value = await appointmentSchema.validateAsync(data);
    const appointment = await appointmentService.createAppointment(value);
    const patient = await patientServices.getPatientById(appointment.patientId);

    // send the mail

    const toEmail = patient.email;
    const subject = "Appointment Confirmation";
    const d = {
      title: "Appointment Confirmation!",
      message: "Please confirm your appointment by clicking the button below:",
      confirmationLink: `http://localhost:3000/appointments/patients/${appointment.slug}`,
      greeting: "We look forward to seeing you soon.",
      note: "Please arrive 15 minutes before the scheduled appointment time.",
    };

    await sendEmail({
      toEmail, subject, d, templateName: "appointment"
    });

    // Log an info message for creating appointment
    logger.info(`Created appointment with id=${appointment.id} to patient with id=${appointment.patientId}`);

    return res.status(201).json(appointment);
  } catch (err) {
    logger.error(`Error creating item: ${err.message}`);
    return resolveError(err, res);
  }
};

const list = async (req, res) => {
  try {
    const { id } = req.user;
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

const updateStatus = async (req, res) => {
  try {
    const { slug } = req.params;
    const appointment = await appointmentService.updateStatus(slug, req.body);
    return res.status(200).json(appointment);
  } catch (err) {
    return resolveError(err, res);
  }
};

const updateStatusPublic = async (req, res) => {
  try {
    const { slug } = req.params;
    const appointment = await appointmentService.updateStatusPublic(slug, req.body);
    return res.status(200).json(appointment);
  } catch (err) {
    return resolveError(err, res);
  }
};

const detailsPublic = async (req, res) => {
  try {
    const { slug } = req.params;
    const appointment = await appointmentService.getAppointmentPublic(slug);
    return res.status(200).json(appointment);
  } catch (err) {
    return resolveError(err, res);
  }
};

module.exports = {
  create, list, retrieveBySlug, retrievebyId, updateStatus, updateStatusPublic, detailsPublic
};
