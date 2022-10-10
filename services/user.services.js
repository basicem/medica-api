const { MedicaError, NotFound } = require("../exceptions");
const db = require("../models");
const { paginate, getLimitAndOffset } = require("../helpers/pagination");

const create = async ({
  firstName,
  lastName,
  email,
  role,
  password,
  isVerified,
  isActive
}) => {
  if ((await db.User.findOne({ where: { email } })) !== null) {
    throw new MedicaError("User with this email already exists");
  }

  try {
    const user = await db.User.create({
      firstName,
      lastName,
      email,
      role,
      password,
      isVerified,
      isActive
    });
    return user;
  } catch (err) {
    throw new MedicaError("Unable to create user.");
  }
};

const update = async (id, data) => {
  const user = await db.User.findOne(
    { where: { id } }
  );

  if (user === null) {
    throw new NotFound("User not found.");
  }

  try {
    user.set(data);
    return await user.save();
  } catch (err) {
    throw new MedicaError("Unable to update user.");
  }
};

const list = async ({ page, pageSize }) => {
  try {
    const { limit, offset } = getLimitAndOffset(page, pageSize);

    const { rows, count } = await db.User.findAndCountAll({
      limit,
      offset,
      order: [
        ["createdAt", "DESC"],
      ],
      attributes: ["id", "firstName", "lastName", "email", "role", "isVerified", "isActive", "createdAt", "updatedAt"],
    });

    return paginate({
      count,
      rows: rows.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
        isVerified: u.isVerified,
        isActive: u.isActive,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt
      })),
      page,
      pageSize,
    });
  } catch (err) {
    throw new MedicaError("Unable to return users");
  }
};

module.exports = {
  create, list, update
};
