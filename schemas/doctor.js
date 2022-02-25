const Joi = require("joi");

const doctorSchema = Joi.object({
  image: Joi.string().required(),
  title: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  practiceArea: Joi.array().items(Joi.number()).required(),
  adress: Joi.string().min(5).required(),
  city: Joi.string().min(2).required(),
  zip: Joi.string()
    .pattern(/^[0-9]+$/)
    .required(),
  country: Joi.string().required(),
  phoneNumber: Joi.string()
    .pattern(/^[+]*[-\s/0-9]*$/)
    .required(),
  website: Joi.string()
    .pattern(
      /^(www\.)+[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/
    )
    .required(),
  workingHours: Joi.array()
    .items(
      Joi.object({
        day: Joi.string().required(),
        workTimeStart: Joi.string()
          .pattern(/^([0-9]{2}):([0-9]{2})$/)
          .required(),
        workTimeEnd: Joi.string()
          .pattern(/^([0-9]{2}):([0-9]{2})$/)
          .required(),
      })
    )
    .required(),
  email: Joi.string().email().lowercase().required(),
});

module.exports = { doctorSchema };
