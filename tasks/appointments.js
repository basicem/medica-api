const cron = require("node-cron");
const { Op } = require("sequelize");
const db = require("../models");

const sendEmail = require("../helpers/email");
const { REMINDER_STATUS } = require("../helpers/constants");
const { MedicaError } = require("../exceptions");

const scheduleReminder = async (reminder) => {
  const minute = reminder.executeAt.getMinutes();
  const hour = reminder.executeAt.getHours();
  const day = reminder.executeAt.getDate();
  const month = reminder.executeAt.getMonth() + 1;
  const year = reminder.executeAt.getFullYear();

  const cronExpression = `${minute} ${hour} ${day} ${month} *`;

  try {
    cron.schedule(cronExpression, async () => {
      // find the appointment
      const appointment = await db.Appointment.findOne({
        where: { id: reminder.appointment_id },
        include: [
          { model: db.Patient, as: "patient" },
          { model: db.User, as: "doctor" }
        ],
        attributes: ["id", "slug", "title", "description", "isVirtual", "link", "status", "startDate", "endDate"],
      });

      // before you send it check if the executeAt is not after appointment date
      if (reminder.executeAt > appointment.startDate) { throw new MedicaError("Failed to send email."); }

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

      // when you send the email make job COMPLETED
      reminder.status = REMINDER_STATUS.COMPLETED;
      await reminder.save();
    });
  } catch (error) {
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
