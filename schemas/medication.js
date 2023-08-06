const Joi = require("joi");
const { FREQUENCY, DOSE_MEASUREMENT } = require("../helpers/constants");

const medicationSchema = Joi.object({
  name: Joi.string().required(),
  doseValue: Joi.number().required(),
  doseMeasurement: Joi.string().valid(...Object.values(DOSE_MEASUREMENT)),
  frequency: Joi.string().valid(...Object.values(FREQUENCY)),
  prescribedOn: Joi.date().iso().messages({ "date.format": "Date format is YYYY-MM-DD" })
    .required(),
  patientId: Joi.number().integer().required(),
});

module.exports = { medicationSchema };
