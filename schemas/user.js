const Joi = require("joi");

const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  role: Joi.string().valid("Admin", "Doctor").required(),
  password: Joi.string().min(5).alphanum().required(),
  isVerified: Joi.boolean().required(),
  isActive: Joi.boolean().required(),
});

module.exports = { userSchema };
