const vitalServices = require("../services/vital.services");
const { vitalSchema } = require("../schemas/vital");
const { resolveError } = require("../helpers/controllers");
const { logger } = require("../logging/logger");

const list = async (req, res) => {
  try {
    const vitals = await vitalServices.list(req.query);
    return res.status(200).json(vitals);
  } catch (err) {
    return resolveError(err, res);
  }
};

const create = async (req, res) => {
  try {
    const value = await vitalSchema.validateAsync(req.body);
    const vital = await vitalServices.create(value);
    logger.info(`Created vital with id=${vital.id}`);
    return res.status(201).json({ id: vital.id });
  } catch (err) {
    logger.error(`Error creating item: ${err.message}`);
    return resolveError(err, res);
  }
};

const update = async (req, res) => {
  try {
    const vital = await vitalServices.editVital(req.body);
    logger.info(`Updated vital with id=${vital.id}`);
    return res.status(200).json({ id: vital.id });
  } catch (err) {
    logger.error(`Error updating item: ${err.message}`);
    return resolveError(err, res);
  }
};

module.exports = {
  create, list, update
};
