const { Op } = require("sequelize");

const { MedicaError, NotFound } = require("../exceptions");
const db = require("../models");

const createAppointment = async ({
  title,
  date,
  duration,
  description,
  isVirtual,
  link,
  isConfirmed,
  doctorId,
  patientId
}) => {
  try {
    const doctor = await db.User.findByPk(doctorId);

    if (!doctor) {
      throw new MedicaError("Unable to create appointment.");
    }

    const patient = await db.Patient.findByPk(patientId);

    if (!patient) {
      throw new MedicaError("Unable to create appointment.");
    }
    // is this ok?
    const numericValue = parseFloat(duration.match(/\d+(\.\d+)?/)[0]);
    const endDate = new Date(date.getTime() + numericValue * 60000);

    const appointment = await db.Appointment.create({
      title,
      description,
      isVirtual,
      link,
      isConfirmed,
      doctor_id: doctorId,
      patient_id: patientId,
      startDate: date,
      endDate
    });
    return appointment;
  } catch (err) {
    throw new MedicaError("Unable to create appointment.");
  }
};

const getAppointmentsByDoctorId = async (id, start, end) => {
  try {
    const doctor = await db.User.findOne(
      { where: { id } }
    );

    if (doctor === null) {
      throw new NotFound("Doctor not found.");
    }

    const appointments = await db.Appointment.findAll(
      {
        where: {
          doctor_id: doctor.id,
          startDate: {
            [Op.gte]: new Date(start),
          },
          endDate: {
            [Op.lte]: new Date(end),
          },
        }
      }
    );
    return appointments;
  } catch (err) {
    throw new MedicaError("Unable to create appointment.");
  }
};

const getAppointment = async (slug) => {
  const appointment = await db.Appointment.findOne({
    where: { slug }
  });

  if (appointment === null) throw new NotFound("Appointment not found.");

  return appointment;
};

module.exports = {
  createAppointment, getAppointmentsByDoctorId, getAppointment
};
