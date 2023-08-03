const Joi = require("joi");

const medicationSchema = Joi.object({
  name: Joi.string().required(),
  dose: Joi.string().pattern(/^\d+\s\w+$/),
  frequency: Joi.string()
    .pattern(/^(?:(?:\d+\s)?(?:po|per os|by mouth|bid|tid|qid|hs|prn|stat|ac|pc)\b)|\w+$/i),
  prescribedOn: Joi.date().iso().messages({ "date.format": "Date format is YYYY-MM-DD" })
    .required(),
  patientId: Joi.number().integer().required(),
  doctorId: Joi.number().integer().required(),
});

module.exports = { medicationSchema };

// all of this is valid
// "1 po qd"
// "2 times per day"
// "3 times per week"
// "4 times per month"
// "bid"
// "tid"
// "hs"
// "prn"
// "as needed"
// "2 times daily"
