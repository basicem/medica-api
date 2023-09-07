const userServices = require("../services/user.services");
const { userSchema, updateuserSchema } = require("../schemas/user");
const { resolveError } = require("../helpers/controllers");
const { logger } = require("../logging/logger");

const list = async (req, res) => {
  try {
    const users = await userServices.list(req.query);
    return res.status(200).json(users);
  } catch (err) {
    return resolveError(err, res);
  }
};

const create = async (req, res) => {
  try {
    const value = await userSchema.validateAsync(req.body);
    const user = await userServices.create(value);
    logger.info(`Created user with id=${user.id}`);
    return res.status(201).json({ id: user.id });
  } catch (err) {
    logger.error(`Error creating item: ${err.message}`);
    return resolveError(err, res);
  }
};

const update = async (req, res) => {
  try {
    const value = await updateuserSchema.validateAsync(req.body);
    const { id } = req.params;
    const user = await userServices.update(id, value);
    logger.info(`Updated user with id=${user.id}`);
    return res.status(200).json({ id: user.id });
  } catch (err) {
    logger.error(`Error updating item: ${err.message}`);
    return resolveError(err, res);
  }
};

module.exports = {
  create, list, update
};
