const cron = require("node-cron");
const { Op } = require("sequelize");
const db = require("../models");

const sendEmail = require("../helpers/email");
const { REMINDER_STATUS } = require("../helpers/constants");
const { MedicaError, NotFound } = require("../exceptions");

const scheduleReminder = async (r) => {
  const minute = r.executeAt.getMinutes();
  const hour = r.executeAt.getHours();
  const day = r.executeAt.getDate();
  const month = r.executeAt.getMonth() + 1;

  const cronExpression = `${minute} ${hour} ${day} ${month} *`;

  try {
    cron.schedule(cronExpression, async () => {
      // find the appointment
      const appointment = await db.Appointment.findOne({
        where: { id: r.appointment_id },
        include: [
          { model: db.Patient, as: "patient" },
          { model: db.User, as: "doctor" }
        ],
        attributes: ["id", "slug", "title", "description", "isVirtual", "link", "status", "startDate", "endDate"],
      });

      if (appointment === null) {
        throw new NotFound("Appointment not found.");
      }

      // find the reminder
      const reminder = await db.AppointmentReminder.findOne({
        where: { id: r.id },
      });

      if (reminder === null) {
        throw new NotFound("Reminder not found.");
      }

      // before you send it check if the executeAt is not after appointment date
      if (reminder.executeAt > appointment.startDate) {
        // set job as FAILED
        reminder.status = REMINDER_STATUS.FAILED;
        reminder.error = "Failed to send email.";
        await reminder.save();
        throw new MedicaError("Failed to send email.");
      }

      // create email to send
      const toEmail = appointment.patient.email;
      const subject = "Appointment Reminder";
      let message = `This is a gentle reminder about appointment on ${appointment.startDate}. 
      If you have questions or concerns before the appointment, you may send an e-mail.`;
      let note = "Please arrive 15 minutes before the scheduled appointment time.";

      if (appointment.isVirtual) {
        message = `This is a gentle reminder about appointment on ${appointment.startDate}. 
        If you have questions or concerns before the appointment, you may send an e-mail.
        The meeting is virtual, the link is: ${appointment.link}`;
        note = "Please be on the link 15 minutes before";
      }
      const d = {
        title: "Appointment Reminder!",
        message,
        greeting: "We look forward to seeing you soon.",
        note,
      };

      // send the email to the patient
      await sendEmail({
        toEmail, subject, d, type: "reminder"
      });

      reminder.status = REMINDER_STATUS.FAILED;
      reminder.error = "Failed to send email.";
      await reminder.save();

      // when you send the email make job COMPLETED
      reminder.status = REMINDER_STATUS.COMPLETED;
      await reminder.save();
    });
  } catch (error) {
    const reminder = await db.AppointmentReminder.findOne({
      where: { id: r.id },
    });
    // set job as FAILED
    reminder.status = REMINDER_STATUS.FAILED;
    reminder.error = "Failed to send email.";
    await reminder.save();
    console.error("Error scheduling cron job:", error);
  }
};

const checkForReminders = async () => {
  const currentTime = new Date();
  const next24Hours = new Date();
  next24Hours.setHours(currentTime.getHours() + 24);

  const reminders = await db.AppointmentReminder.findAll(
    {
      where: {
        status: REMINDER_STATUS.PENDING,
        executeAt: {
          [Op.gte]: new Date(currentTime),
          [Op.lte]: new Date(next24Hours),
        },
      }
    }
  );

  reminders.forEach(async (reminder) => {
    reminder.status = REMINDER_STATUS.SCHEDULED;
    await reminder.save();
    scheduleReminder(reminder);
  });
};

cron.schedule("*/10 * * * *", () => {
  checkForReminders();
});

module.exports = {
  checkForReminders,
  scheduleReminder,
};

// * * * * * *
// | | | | | |
// | | | | | day of week
// | | | | month
// | | | day of month
// | | hour
// | minute
// second ( optional )
