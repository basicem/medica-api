const doctorServices = require("../services/doctor.services");
const { doctorSchema } = require("../schemas/doctor");
const { MedicaError } = require("../exceptions");

exports.create = async (req, res) => {
  try {
    const value = await doctorSchema.validateAsync(req.body);

    const doctor = await doctorServices.createDoctor(value);

    return res.status(200).json(doctor);
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ error: err.details });
    }
    if (err instanceof MedicaError) {
      return res.status(400).json({ error: err.message });
    }
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
