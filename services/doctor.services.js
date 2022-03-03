const { Op } = require("sequelize");

const { MedicaError } = require("../exceptions");
const db = require("../models");
const { paginate, getLimitAndOffset } = require("../controllers/helpers");

exports.createDoctor = async ({
  image,
  title,
  firstName,
  lastName,
  practiceArea,
  address,
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
      address,
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

exports.getAllDoctors = async ({ name, practiceArea, page, pageSize }) => {
  try {
    const { limit, offset } = getLimitAndOffset(page, pageSize);
    const practiceAreaFilters = {};
    const doctorFilters = {};
    if (name) {
      doctorFilters[Op.or] = [
        { firstName: { [Op.iLike]: `%${name}` } },
        { lastName: { [Op.iLike]: `%${name}` } },
      ];
    }
    if (practiceArea) {
      practiceAreaFilters.practiceAreaId = practiceArea;
    }

    const { rows, count } = await db.Doctor.findAndCountAll({
      limit,
      offset,
      where: doctorFilters,
      include: [
        {
          model: db.DoctorPracticeArea,
          include: [
            {
              model: db.PracticeArea,
              attributes: ["id", "name"],
            },
          ],
          where: practiceAreaFilters,
          attributes: ["practiceAreaId"],
        },
        {
          model: db.WorkingHours,
          attributes: ["day", "workTimeStart", "workTimeEnd"],
        },
      ],
      attributes: ["id", "image", "firstName", "lastName"],
    });

    return paginate({
      count,
      rows,
      page,
      pageSize,
    });
  } catch (err) {
    console.log(err);
    throw new MedicaError("Unable to return doctors");
  }
};
