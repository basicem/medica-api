const { Op } = require("sequelize");
const { MedicaError } = require("../exceptions");
const db = require("../models");

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

exports.getAllDoctors = async ({ name, practiceArea }) => {
  try {
    let doctors = [];
    if (typeof name === "undefined" && typeof practiceArea === "undefined") {
      doctors = await db.Doctor.findAll({
        include: [
          {
            model: db.DoctorPracticeArea,

            include: [{ model: db.PracticeArea, attributes: ["id", "name"] }],
            attributes: ["id"],
          },
          {
            model: db.WorkingHours,
            attributes: ["day", "workTimeStart", "workTimeEnd"],
          },
        ],
        attributes: ["image", "first_name", "last_name"],
      });
    } else if (typeof name !== "undefined") {
      doctors = await db.Doctor.findAll({
        where: { [Op.or]: [{ first_name: name }, { last_name: name }] },
        include: [
          {
            model: db.DoctorPracticeArea,

            include: [{ model: db.PracticeArea, attributes: ["id", "name"] }],
            attributes: ["id"],
          },
          {
            model: db.WorkingHours,
            attributes: ["day", "workTimeStart", "workTimeEnd"],
          },
        ],
        attributes: ["image", "first_name", "last_name"],
      });
    } else if (typeof practiceArea !== "undefined") {
      doctors = await db.Doctor.findAll({
        include: [
          {
            model: db.DoctorPracticeArea,

            include: [
              {
                model: db.PracticeArea,
                attributes: ["id", "name"],
                where: { id: practiceArea },
              },
            ],
            attributes: ["id"],
          },
          {
            model: db.WorkingHours,
            attributes: ["day", "workTimeStart", "workTimeEnd"],
          },
        ],
        attributes: ["image", "first_name", "last_name"],
      });
    }
    return doctors;
  } catch (err) {
    throw new MedicaError("Unable to return doctors");
  }
};
