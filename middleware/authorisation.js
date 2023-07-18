const jwt = require("jsonwebtoken");
const ROLES = require("../helpers/constants");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);

    req.user = decoded.user.id;
    req.role = decoded.user.role;
    return next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

const verifyRoles = (allowedRole) => (req, res, next) => {
  if (!req?.role) return res.sendStatus(401);
  if (req.role === ROLES.ADMIN) return next();
  if (allowedRole === req.role) return next();
  return res.sendStatus(401);
};

module.exports = {
  verifyJWT, verifyRoles
};
