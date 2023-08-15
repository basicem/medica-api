const { Op } = require("sequelize");

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

const editVital = async (data) => {
  const vital = await db.Vital.findOne(
    { where: { id: data.id } }
  );

  if (vital === null) {
    throw new NotFound("Vital not found.");
  }

  try {
    vital.set(data);
    return await vital.save();
  } catch (err) {
    throw new MedicaError("Unable to update vital.");
  }
};

const list = async ({ search }) => {
  const vitals = await db.Vital.findAll({
    where: {
      name: { [Op.iLike]: `${search}%` },
    },
    attributes: ["id", "name", "unitMeasurement", "lowerLimit", "upperLimit"],
    order: [
      ["updatedAt", "DESC"],
    ],
    limit: 100
  });

  if (vitals === null) throw new NotFound("Vitals not found.");

  return vitals;
};

module.exports = { create, list, editVital };
