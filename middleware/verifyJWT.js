const jwt = require("jsonwebtoken");

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
    // console.log(err);
    return res.sendStatus(403);
  }
};

const verifyRoles = (allowedRoles) => (req, res, next) => {
  if (!req?.role) return res.sendStatus(401);
  // porediti dvije jesul iste ako jesu ok ako nisu
  // TODO
  console.log(allowedRoles);
  console.log(req.role);
  const result = true;
  if (!result) return res.sendStatus(401);
  return next();
};

module.exports = {
  verifyJWT, verifyRoles
};
