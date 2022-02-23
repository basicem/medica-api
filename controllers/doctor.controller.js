const doctorServices = require("../services/doctor.services");

exports.create = async (req, res) => {
  try {
    const doctor = await doctorServices.createDoctor(req.body);

    return res.status(200).json(doctor);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
