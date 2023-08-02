const { Op } = require("sequelize");

const { MedicaError, NotFound } = require("../exceptions");
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
  email,
  doctorId
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
      email,
      doctor_id: doctorId
    });
    return patient;
  } catch (err) {
    throw new MedicaError("Unable to create patient.");
  }
};

const editPatient = async (id, data) => {
  const patient = await db.Patient.findOne(
    { where: { id } }
  );

  if (patient === null) {
    throw new NotFound("Patient not found.");
  }

  try {
    patient.set(data);
    return await patient.save();
  } catch (err) {
    throw new MedicaError("Unable to update patient.");
  }
};

const getAllPatients = async ({
  search, page, pageSize, doctorId
}) => {
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
    patientFilters[Op.and] = [
      { doctor_id: { [Op.eq]: doctorId } },
    ];

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

const searchPatients = async ({ search, doctorId }) => {
  try {
    const page = 0;
    const pageSize = 30;
    const { limit, offset } = getLimitAndOffset(page, pageSize);
    console.log("Search je: ", search);
    console.log("DoctorId je: ", doctorId);
    const { rows, count } = await db.Patient.findAndCountAll({
      limit,
      offset,
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { firstName: { [Op.iLike]: `${search}%` } },
              { lastName: { [Op.iLike]: `${search}%` } },
            ],
          },
          { doctor_id: { [Op.eq]: doctorId } },
        ],
      },
      order: [
        ["firstName", "ASC"],
        ["lastName", "ASC"]
      ],
      attributes: ["id", "image", "firstName", "lastName", "email", "doctor_id"],
    });
    console.log("Hi: ", rows);
    return paginate({
      count,
      rows: rows.map((a) => ({
        id: a.id,
        image: a.image,
        firstName: a.firstName,
        lastName: a.lastName,
        email: a.email,
      })),
      page,
      pageSize,
    });
  } catch (err) {
    throw new MedicaError("Unable to return patients");
  }
};

const getPatientBySlug = async (slug) => {
  const patient = await db.Patient.findOne({
    where: { slug },
    attributes: ["id", "slug", "image", "firstName", "lastName", "dateOfBirth",
      "email", "phoneNumber", "address", "city", "createdAt", "updatedAt"],
  });

  if (patient === null) throw new NotFound("Patient not found.");

  return patient;
};

const getPatientById = async (id) => {
  const patient = await db.Patient.findOne({
    where: { id },
    attributes: ["id", "slug", "image", "firstName", "lastName", "dateOfBirth",
      "email", "phoneNumber", "address", "city", "createdAt", "updatedAt"],
  });

  if (patient === null) throw new NotFound("Patient not found.");

  return patient;
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

const addMedication = async ({
  name,
  dose,
  frequency,
  prescribedOn,
  patientId
}) => {
  if ((await db.Patient.findOne({ where: { id: patientId } })) === null) {
    throw new MedicaError("Patient not found");
  }
  try {
    const medication = await db.Medication.create({
      name,
      dose,
      frequency,
      prescribedOn,
      patient_id: patientId
    });
    return medication;
  } catch (err) {
    throw new MedicaError("Unable to add medication.");
  }
};

const getAllMedication = async ({
  patientId, page, pageSize
}) => {
  try {
    const { limit, offset } = getLimitAndOffset(page, pageSize);

    const { rows, count } = await db.Medication.findAndCountAll({
      limit,
      offset,
      where: {
        patient_id: patientId
      },
      order: [
        ["prescribedOn", "DESC"],
      ],
      attributes: ["id", "name", "dose", "frequency", "prescribedOn"],
    });

    return paginate({
      count,
      rows: rows.map((m) => ({
        id: m.id,
        name: m.name,
        dose: m.dose,
        frequency: m.frequency,
        prescribedOn: m.prescribedOn,
      })),
      page,
      pageSize,
    });
  } catch (err) {
    throw new MedicaError("Unable to return medications");
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientBySlug,
  deletePatient,
  editPatient,
  getPatientById,
  searchPatients,
  addMedication,
  getAllMedication,
};
