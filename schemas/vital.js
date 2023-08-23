const Joi = require("joi");

const vitalSchema = Joi.object({
  name: Joi.string().required(),
  unitMeasurement: Joi.string().required(),
  lowerLimit: Joi.number().required(),
  upperLimit: Joi.number().required(),
});

module.exports = { vitalSchema };
