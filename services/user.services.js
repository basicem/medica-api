const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

const { MedicaError, NotFound } = require("../exceptions");
const db = require("../models");
const { paginate, getLimitAndOffset } = require("../helpers/pagination");
const { sendEmail } = require("../helpers/email");

const sendUserCreateEmail = async (user, rawPassword) => {
  const to = user.email;
  const from = process.env.NO_REPLY_EMAIL;
  const subject = "[WELCOME TO MEDICA]";
  const text = `Hello, here is your password: ${rawPassword}`;
  const html = `<p>Hello, here is your password: ${rawPassword}</p>`;

  await sendEmail(to, from, subject, text, html);
};

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
    const salt = await bcrypt.genSaltSync(10, "a");
    const user = await db.User.create({
      firstName,
      lastName,
      email,
      role,
      password: bcrypt.hashSync(password, salt),
      isVerified,
      isActive
    });
    await sendUserCreateEmail(user, password);
    return user;
  } catch (err) {
    throw new MedicaError("Unable to create user.");
  }
};

const update = async (id, data) => {
  // console.log("User is: ", id);
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

const get = async (identifier) => {
  let user;

  if (typeof identifier === "string") {
    // Search by email
    user = await db.User.findOne({ where: { email: identifier } });
  } else if (typeof identifier === "number") {
    // Search by id
    user = await db.User.findOne({ where: { id: identifier } });
  } else {
    throw new Error("Invalid identifier type.");
  }

  if (user === null) {
    throw new NotFound("User not found.");
  }

  return user;
};

const list = async ({
  search, role, active, verified, page, pageSize
}) => {
  try {
    const { limit, offset } = getLimitAndOffset(page, pageSize);
    const isActive = (active === "true");
    const isVerified = (verified === "true");
    const userFilters = {};

    if (search) {
      userFilters[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}` } },
        { lastName: { [Op.iLike]: `%${search}` } },
        { email: { [Op.iLike]: `%${search}` } },
      ];
    }
    if (role) {
      userFilters.role = { [Op.iLike]: `%${role}` };
    }
    if (active) {
      userFilters.isActive = { [Op.is]: isActive };
    }
    if (verified) {
      userFilters.isVerified = { [Op.is]: isVerified };
    }

    const { rows, count } = await db.User.findAndCountAll({
      limit,
      offset,
      where: userFilters,
      order: [
        ["firstName"],
        ["lastName"],
        ["email"],
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
  create, list, update, get
};
