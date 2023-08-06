const db = require("../models");

const hasPatientPermission = async (user, { id, slug }) => {
  let patient = null;
  if (id) {
    patient = await db.Patient.findOne({
      where: { id }
    });
  } else if (slug) {
    patient = await db.Patient.findOne({
      where: { slug }
    });
  }

  if (patient === null) return false;

  if (patient.doctorId !== user.id) return false;

  return true;
};

module.exports = {
  hasPatientPermission
};
