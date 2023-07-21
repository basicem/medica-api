const Joi = require("joi");

const appointmentSchema = Joi.object({
  title: Joi.string().required(),
  date: Joi.date().iso().messages({ "date.format": "Date format is YYYY-MM-DD" })
    .required(),
  duration: Joi.string().required().pattern(/^(\d+\.?\d*) minutes$/),
  description: Joi.string().required(),
  isVirtual: Joi.boolean().required(),
  link: Joi.string().allow(null),
  isConfirmed: Joi.boolean(),
  doctorId: Joi.number().integer().required(),
  patientId: Joi.number().integer().required()
});

module.exports = { appointmentSchema };
