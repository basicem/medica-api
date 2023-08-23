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
  doseValue,
  doseMeasurement,
  frequency,
  prescribedOn,
  patientId
}) => {
  const patient = await db.Patient.findOne({
    where: { id: patientId },
  });

  if (patient === null) throw new NotFound("Patient not found.");

  try {
    const medication = await db.Medication.create({
      name,
      doseValue,
      doseMeasurement,
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
      attributes: ["id", "name", "doseValue", "doseMeasurement", "frequency", "prescribedOn"],
    });
    return paginate({
      count,
      rows: rows.map((m) => ({
        id: m.id,
        name: m.name,
        doseValue: m.doseValue,
        doseMeasurement: m.doseMeasurement,
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

const deleteMedication = async (medicationId) => {
  try {
    return await db.Medication.destroy({
      where: { id: medicationId }
    });
  } catch (err) {
    throw new MedicaError("Unable to delete medication");
  }
};

const editMedication = async (data, medicationId) => {
  const medication = await db.Medication.findOne(
    { where: { id: medicationId } }
  );

  if (medication === null) {
    throw new NotFound("Medication not found.");
  }

  try {
    medication.set(data);
    return await medication.save();
  } catch (err) {
    throw new MedicaError("Unable to update medication.");
  }
};

const addPatientVital = async ({
  patientId,
  vitalId,
  value,
}) => {
  const patient = await db.Patient.findOne({
    where: { id: patientId },
  });

  if (patient === null) throw new NotFound("Patient not found.");

  const vital = await db.Vital.findOne({
    where: { id: vitalId },
  });

  if (vital === null) throw new NotFound("Vital not found.");

  const optPatientVital = await db.PatientVital.findOne({
    where: { patient_id: patientId, vital_id: vitalId, isArchived: false }
  });

  const t = await db.sequelize.transaction();

  try {
    if (optPatientVital !== null) {
      optPatientVital.isArchived = true;
      optPatientVital.archivedAt = new Date();
      await optPatientVital.save();
    }

    const patientVital = await db.PatientVital.create({
      patient_id: patientId,
      vital_id: vitalId,
      value,
      isArchived: false,
      archivedAt: null,
    });

    await t.commit();
    return patientVital;
  } catch (err) {
    await t.rollback();
    throw new MedicaError("Unable to add vital to patient.");
  }
};

const getAllPatientVitals = async ({ patientId }) => {
  try {
    const patientVitals = await db.PatientVital.findAll({
      include: [
        { model: db.Vital, as: "vital", attributes: ["id", "name", "unitMeasurement", "lowerLimit", "upperLimit"] },
      ],
      where: {
        patient_id: patientId,
        isArchived: false
      },
      order: [
        ["createdAt", "DESC"],
      ],
      attributes: ["id", "value", "createdAt"],
    });
    return patientVitals;
  } catch (err) {
    throw new MedicaError("Unable to return vitals for patient.");
  }
};

const getPatientVitalHistory = async ({
  patientId, vitalId, page, pageSize
}) => {
  try {
    const { limit, offset } = getLimitAndOffset(page, pageSize);

    const { rows, count } = await db.PatientVital.findAndCountAll({
      limit,
      offset,
      include: [
        { model: db.Vital, as: "vital", attributes: ["id", "name", "unitMeasurement", "lowerLimit", "upperLimit"] },
      ],
      where: {
        patient_id: patientId,
        vital_id: vitalId
      },
      order: [
        ["createdAt", "DESC"],
      ],
      attributes: ["id", "value", "createdAt"],
    });

    return paginate({
      count,
      rows,
      page,
      pageSize,
    });
  } catch (err) {
    throw new MedicaError("Unable to return vitals for patient.");
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
  deleteMedication,
  editMedication,
  addPatientVital,
  getAllPatientVitals,
  getPatientVitalHistory
};
