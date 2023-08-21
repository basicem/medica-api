const jwt = require("jsonwebtoken");
const ROLES = require("../helpers/constants");
const userServices = require("../services/user.services");

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
    const user = await userServices.getById(decoded.user.id);
    req.user = user;
    return next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

const verifyRoles = (allowedRoles) => (req, res, next) => {
  if (!req?.user.role) return res.sendStatus(401);
  if (req.user.role === ROLES.ADMIN) return next();
  if (allowedRoles.includes(req.user.role)) return next();
  return res.sendStatus(401);
};

module.exports = {
  verifyJWT, verifyRoles
};
