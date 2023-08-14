const { MedicaError, NotFound } = require("../exceptions");
const db = require("../models");

const create = async ({
  name,
  unitMeasurement,
  lowerLimit,
  upperLimit,
}) => {
  if ((await db.Vital.findOne({ where: { name } })) !== null) {
    throw new MedicaError("Vital with this name already exists");
  }

  try {
    const vital = await db.Vital.create({
      name,
      unitMeasurement,
      lowerLimit,
      upperLimit,
    });
    return vital;
  } catch (err) {
    throw new MedicaError("Unable to create vital.");
  }
};

const list = async () => {
  const vitals = await db.Vital.findAll({
    attributes: ["id", "name", "unitMeasurement", "lowerLimit", "upperLimit"],
  });

  if (vitals === null) throw new NotFound("Vitals not found.");

  return vitals;
};

module.exports = { create, list };
