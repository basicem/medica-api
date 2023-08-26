const { Op } = require("sequelize");

const { MedicaError, NotFound } = require("../exceptions");
const db = require("../models");

const { STATUS, REMINDER_STATUS } = require("../helpers/constants");

const createAppointment = async ({
  title,
  date,
  time,
  duration,
  description,
  isVirtual,
  link,
  status,
  doctorId,
  patientId,
  reminders
}) => {
  const t = await db.sequelize.transaction();
  try {
    const doctor = await db.User.findByPk(doctorId);

    if (!doctor) {
      throw new MedicaError("Unable to create appointment.");
    }

    const patient = await db.Patient.findByPk(patientId);

    if (!patient) {
      throw new MedicaError("Unable to create appointment.");
    }
    const [hours, minutes] = time.split(":");
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(parseInt(hours, 10));
    combinedDateTime.setMinutes(parseInt(minutes, 10));

    const numericValue = parseFloat(duration.match(/\d+(\.\d+)?/)[0]);
    const endDate = new Date(combinedDateTime.getTime() + numericValue * 60000);

    const appointment = await db.Appointment.create(
      {
        title,
        description,
        isVirtual,
        link,
        status,
        doctorId,
        patientId,
        startDate: combinedDateTime,
        endDate
      }
    );
    // create reminders
    const newReminders = [];

    reminders.forEach((minutesBeforeAppointment) => {
      const executeAt = new Date(appointment.startDate);
      executeAt.setMinutes(executeAt.getMinutes() - minutesBeforeAppointment);

      newReminders.push({
        status: REMINDER_STATUS.PENDING,
        error: false,
        minutes: minutesBeforeAppointment,
        appointmentId: appointment.id,
        executeAt
      });
    });

    await db.AppointmentReminder.bulkCreate(newReminders);

    await t.commit();
    return appointment;
  } catch (err) {
    await t.rollback();
    throw new MedicaError("Unable to create appointment.");
  }
};

const getAppointmentsByDoctor = async (id, { start, end }) => {
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
          doctorId: doctor.id,
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
    console.log("Err is: ", err);
    throw new MedicaError("Unable to get appointment.");
  }
};

const getAppointmentBySlug = async (slug) => {
  const appointment = await db.Appointment.findOne({
    where: { slug },
    include: [
      { model: db.Patient, as: "patient" },
      { model: db.User, as: "doctor" }
    ],
    attributes: ["id", "slug", "title", "description", "isVirtual", "link", "status", "startDate", "endDate"],
  });

  if (appointment === null) throw new NotFound("Appointment not found.");

  return appointment;
};

const getAppointmentById = async (id) => {
  const appointment = await db.Appointment.findOne({
    where: { id },
    include: [
      { model: db.Patient, as: "patient" },
      { model: db.User, as: "doctor" }
    ],
    attributes: ["id", "slug", "title", "description", "isVirtual", "link", "status", "startDate", "endDate"],
  });

  if (appointment === null) throw new NotFound("Appointment not found.");

  return appointment;
};

const updateStatus = async (slug, data) => {
  const appointment = await db.Appointment.findOne({
    where: { slug }
  });

  if (appointment === null) throw new NotFound("Appointment not found.");

  try {
    appointment.set(data);
    return await appointment.save();
  } catch (err) {
    throw new MedicaError("Unable to update appointment.");
  }
};

const updateStatusPublic = async (slug, data) => {
  const appointment = await db.Appointment.findOne({
    where: { slug }
  });

  if (appointment === null) throw new NotFound("Appointment not found.");
  if (appointment.status !== STATUS.PENDING) throw new NotFound("Unable to update appointment.");

  try {
    appointment.set(data);
    return await appointment.save();
  } catch (err) {
    throw new MedicaError("Unable to update appointment.");
  }
};

const getAppointmentPublic = async (slug) => {
  const appointment = await db.Appointment.findOne({
    where: { slug },
    include: [
      { model: db.Patient, as: "patient" },
      { model: db.User, as: "doctor" }
    ],
    attributes: ["id", "slug", "title", "description", "isVirtual", "link", "status", "startDate", "endDate"],
  });

  if (appointment === null) throw new NotFound("Appointment not found.");

  return appointment;
};

module.exports = {
  createAppointment,
  getAppointmentsByDoctor,
  getAppointmentBySlug,
  getAppointmentById,
  updateStatus,
  updateStatusPublic,
  getAppointmentPublic,
};
