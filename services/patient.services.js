const { Op } = require("sequelize");

const { MedicaError } = require("../exceptions");
const db = require("../models");
const { paginate, getLimitAndOffset } = require("../helpers/pagination");

const createPatient = async ({
  image,
  firstName,
  lastName,
  address,
  city,
  phoneNumber,
  email
}) => {
  if ((await db.Patient.findOne({ where: { email } })) !== null) {
    throw new MedicaError("Patient with this email already exists");
  }

  try {
    const patient = await db.Patient.create({
      image,
      firstName,
      lastName,
      address,
      city,
      phoneNumber,
      email
    });
    return patient;
  } catch (err) {
    throw new MedicaError("Unable to create patient.");
  }
};

const getAllPatients = async ({ search, page, pageSize }) => {
  try {
    const { limit, offset } = getLimitAndOffset(page, pageSize);
    const patientFilters = {};
    if (search) {
      patientFilters[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}` } },
        { lastName: { [Op.iLike]: `%${search}` } },
        { email: { [Op.iLike]: `%${search}` } },
      ];
    }

    const { rows, count } = await db.Patient.findAndCountAll({
      limit,
      offset,
      where: patientFilters,
      attributes: ["id", "image", "firstName", "lastName", "email", "phoneNumber", "address"],
    });

    return paginate({
      count,
      rows: rows.map((p) => ({
        id: p.id,
        image: p.image,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        phoneNumber: p.phoneNumber,
        address: p.address
      })),
      page,
      pageSize,
    });
  } catch (err) {
    throw new MedicaError("Unable to return patients");
  }
};

module.exports = { createPatient, getAllPatients };
