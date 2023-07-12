const userServices = require("../services/user.services");
const authService = require("../services/auth.services");
const { resolveError } = require("../helpers/controllers");
const { MedicaError } = require("../exceptions");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userServices.get(email);
    // check if user is active and verified and if the user exists
    // TODO: is this throw error okay or should everything be handeled in user.services??
    if (!user.isActive || !user.isVerified) {
      throw new MedicaError("User not active or verified.");
    }
    const accessToken = await authService.getToken(password, user.dataValues);
    return res.status(200).json(accessToken);
  } catch (err) {
    return resolveError(err, res);
  }
};

const session = async (req, res) => {
  try {
    // check the token
    const { token } = req.query;
    const { id } = await authService.verifyToken(token);
    // return the user
    const user = await userServices.get(id);
    return res.status(200).json(user);
  } catch (err) {
    return resolveError(err, res);
  }
};

module.exports = {
  login, session
};
