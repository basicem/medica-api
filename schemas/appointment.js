const Joi = require("joi");

const appointmentSchema = Joi.object({
  title: Joi.string().required(),
  date: Joi.date().iso().messages({ "date.format": "Date format is YYYY-MM-DD" })
    .required(),
  duration: Joi.string().required().pattern(/^(\d+\.?\d*) minutes$/),
  description: Joi.string().required(),
  isVirtual: Joi.boolean().required(),
  link: Joi.string().when("isVirtual", {
    is: true,
    then: Joi.string().required().messages({ "any.required": "Meeting link is required" }),
    otherwise: Joi.string().allow("").optional(),
  }),
  time: Joi.string().regex(/^\d{1,2}:\d{2}$/).messages({
    "string.pattern.base": "Time format should be HH:MM",
  }),
  status: Joi.string().valid("Pending", "Confirmed", "Canceled").required(),
  doctorId: Joi.number().integer().required(),
  patientId: Joi.number().integer().required(),
  reminders: Joi.array().items(Joi.number().integer()).required(),
});

module.exports = { appointmentSchema };
