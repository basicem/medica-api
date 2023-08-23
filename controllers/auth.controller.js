const userServices = require("../services/user.services");
const authService = require("../services/auth.services");
const { resolveError } = require("../helpers/controllers");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userServices.getByEmail(email);
    const accessToken = await authService.authenticate(password, user.dataValues);
    return res.status(200).json(accessToken);
  } catch (err) {
    return resolveError(err, res);
  }
};

const session = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    // Check if the Authorization header is present
    if (!authorizationHeader) {
      return res.status(401).json("Unauthorized");
    }
    const token = authorizationHeader.split(" ")[1];
    const payload = await authService.verifyToken(token);
    const user = await userServices.getById(payload.id);
    return res.status(200).json(user);
  } catch (err) {
    return resolveError(err, res);
  }
};

module.exports = {
  login, session
};
