const Joi = require("joi");

const patientVitalSchema = Joi.object({
  patientId: Joi.number().integer().required(),
  vitalId: Joi.number().integer().required(),
  value: Joi.number().required(),
});

module.exports = { patientVitalSchema };
