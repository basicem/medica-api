const res = require("express/lib/response");
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

exports.getAllDoctors = async ({ firstName, lastName, practiceArea }) => {
  try {
    if (typeof firstName !== "undefined" && typeof lastName !== "undefined") {
      const doctors = await db.Doctor.findAll({
        where: { firstName, lastName },
        attributes: ["id", "image", "first_name", "last_name"],
      });
      const returnDoctors = [];

      // PROCITAJ OVO

      // doctors.forEach(async (doctor) => {
      await Promise.all(
        doctors.map(async (doctor) => {
          // for (const doctor of doctors) {
          const practiceAreaNew = await db.DoctorPracticeArea.findAll({
            where: { doctor_id: doctor.id },
          });
          const workingHoursNew = await db.WorkingHours.findAll({
            where: { doctor_id: doctor.id },
          });
          returnDoctors.push({
            image: doctor.image,
            practiceArea: practiceAreaNew,
            firstName: doctor.first_name,
            lastName: doctor.last_name,
            workingHours: workingHoursNew,
          });
        })
      );
      return returnDoctors;
    }
    // if (typeof practiceArea !== "undefined") {
    //   return await db.Doctor.findAll({
    //     where: { practiceArea },
    //   });
    // }
    // const doctors = await db.Doctor.findAll();
    // return doctors;
  } catch (err) {
    throw new MedicaError("Unable to return doctors");
  }
};
