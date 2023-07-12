const userServices = require("../services/user.services");
const { userSchema, updateuserSchema } = require("../schemas/user");
const { resolveError } = require("../helpers/controllers");

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
    return res.status(201).json({ id: user.id });
  } catch (err) {
    return resolveError(err, res);
  }
};

const update = async (req, res) => {
  try {
    const value = await updateuserSchema.validateAsync(req.body);
    const { id } = req.params;
    const user = await userServices.update(id, value);
    return res.status(200).json({ id: user.id });
  } catch (err) {
    return resolveError(err, res);
  }
};

module.exports = {
  create, list, update
};
