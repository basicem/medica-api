const checkPermission = (permission) => (req, res, next) => {
  if (permission(req.user, req.params)) {
    return next();
  }
  return res.sendStatus(403).json({ message: "You are allowed to perform this action." });
};

module.exports = {
  checkPermission
};
