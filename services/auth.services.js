const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { MedicaError, NotFound } = require("../exceptions");

const authenticate = async (password, user) => {
  let accessToken = null;
  // first check if user is active and verifies
  if (user && (!user.isActive || !user.isVerified)) {
    throw new MedicaError("User not found.");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    // Create token
    accessToken = jwt.sign(
      {
        user: {
          id: user.id,
          role: user.role
        }
      },
      process.env.ACCESS_JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
  }

  if (accessToken === null) {
    throw new MedicaError("User not found");
  }
  return accessToken;
};

const verifyToken = async (token) => {
  const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
  const { user } = decoded;
  if (user === null) {
    throw new NotFound("User not found.");
  }
  return user;
};

module.exports = {
  authenticate, verifyToken
};
