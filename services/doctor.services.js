const { Op } = require("sequelize");

const { MedicaError } = require("../exceptions");
const db = require("../models");
const helpers = require("../controllers/helpers");

exports.createDoctor = async ({
  image,
  title,
  firstName,
  lastName,
  practiceArea,
  adress,
  city,
  zip,
  country,
  phoneNumber,
  website,
  workingHours,
  email,
}) => {
  if ((await db.Doctor.findOne({ where: { email } })) !== null) {
    throw new MedicaError("Doctor with this email already exists");
  }

  try {
    const doctor = await db.Doctor.create({
      image,
      title,
      firstName,
      lastName,
      adress,
      city,
      zip,
      country,
      phoneNumber,
      website,
      email,
    });

    // TODO: Move to bulk insert
    workingHours.forEach(async (workingHours1) => {
      await db.WorkingHours.create({
        ...workingHours1,
        doctor_id: doctor.id,
      });
    });

    practiceArea.forEach(async (practiceArea1) => {
      await db.DoctorPracticeArea.create({
        doctor_id: doctor.id,
        practice_area_id: practiceArea1,
      });
    });

    return doctor;
  } catch (err) {
    throw new MedicaError("Unable to create doctor");
  }
};

exports.getAllDoctors = async ({
  doctorFilter,
  practiceAreaFilter,
  page,
  size,
}) => {
  try {
    const { limit, offset } = helpers.pagination(page, size);
    const whereStatement = {};
    let orStatement = {};
    if (doctorFilter) {
      orStatement = {
        [Op.or]: [
          { first_name: { [Op.iLike]: `%${doctorFilter}` } },
          { last_name: { [Op.iLike]: `%${doctorFilter}` } },
        ],
      };
    }
    if (practiceAreaFilter) {
      whereStatement.practice_area_id = practiceAreaFilter;
    }

    return await db.Doctor.findAll({
      limit,
      offset,
      where: orStatement,
      include: [
        {
          model: db.DoctorPracticeArea,
          include: [
            {
              model: db.PracticeArea,
              attributes: ["id", "name"],
            },
          ],
          where: whereStatement,
          attributes: ["id"],
        },
        {
          model: db.WorkingHours,
          attributes: ["day", "workTimeStart", "workTimeEnd"],
        },
      ],
      attributes: ["id", "image", "firstName", "lastName"],
    });
  } catch (err) {
    throw new MedicaError("Unable to return doctors");
  }
};
