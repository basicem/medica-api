const vitalServices = require("../services/vital.services");
const { resolveError } = require("../helpers/controllers");

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
    const vital = await vitalServices.create(req.body);
    return res.status(201).json({ id: vital.id });
  } catch (err) {
    return resolveError(err, res);
  }
};

module.exports = {
  create, list
};
