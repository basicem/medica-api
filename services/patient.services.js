const { Op } = require("sequelize");

const { MedicaError } = require("../exceptions");
const db = require("../models");
const { paginate, getLimitAndOffset } = require("../helpers/pagination");

const createPatient = async ({
  image,
  firstName,
  lastName,
  dateOfBirth,
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
      dateOfBirth,
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

const editPatient = async (id, data) => {
  try {
    const patient = await db.Patient.findOne(
      { where: { id } }
    );
    if (patient === null) {
      throw new MedicaError();
    }
    patient.set(data);
    return await patient.save();
  } catch (err) {
    throw new MedicaError("Unable to update patient.");
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
      order: [
        ["createdAt", "DESC"],
      ],
      attributes: ["id", "slug", "image", "firstName", "lastName", "dateOfBirth", "email", "phoneNumber", "address", "city", "createdAt", "updatedAt"],
    });

    return paginate({
      count,
      rows: rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        image: p.image,
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: p.dateOfBirth,
        email: p.email,
        phoneNumber: p.phoneNumber,
        address: p.address,
        city: p.city,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      })),
      page,
      pageSize,
    });
  } catch (err) {
    throw new MedicaError("Unable to return patients");
  }
};

const getPatient = async (slug) => {
  try {
    const patient = await db.Patient.findOne({
      where: { slug },
      attributes: ["id", "slug", "image", "firstName", "lastName", "dateOfBirth",
        "email", "phoneNumber", "address", "city", "createdAt", "updatedAt"],
    });
    if (patient === null) throw new MedicaError();
    return patient;
  } catch (err) {
    throw new MedicaError("Unable to return patient");
  }
};

const deletePatient = async (id) => {
  try {
    return await db.Patient.destroy({
      where: { id }
    });
  } catch (err) {
    throw new MedicaError("Unable to delete patient");
  }
};

module.exports = {
  createPatient, getAllPatients, getPatient, deletePatient, editPatient
};
