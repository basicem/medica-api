const Joi = require("joi");

const patientSchema = Joi.object({
  image: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().iso().messages({ "date.format": "Date format is YYYY-MM-DD" })
    .required(),
  address: Joi.string().min(5).required(),
  city: Joi.string().min(2).required(),
  phoneNumber: Joi.string()
    .pattern(/^[+]*[-\s/0-9]*$/)
    .required(),
  email: Joi.string().email().lowercase().required(),
  doctorId: Joi.number().integer().required()
});

module.exports = { patientSchema };
