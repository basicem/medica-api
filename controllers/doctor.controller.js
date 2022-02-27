const doctorServices = require("../services/doctor.services");
const { doctorSchema } = require("../schemas/doctor");
const { MedicaError } = require("../exceptions");

async function create(req, res) {
  try {
    const value = await doctorSchema.validateAsync(req.body);

    const doctor = await doctorServices.createDoctor(value);

    return res.status(201).json({ id: doctor.id });
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
}

async function get(req, res) {
  try {
    // const queries = req.query;
    // console.log(queries);
    const doctors = await doctorServices.getAllDoctors(req.query);
    return res.status(201).json(doctors);
    // if (Object.entries(queries).length === 0) {
    //   console.log("Vrati sve doktore");
    //   const doctors = await doctorServices.getAllDoctors();
    //   return res.status(201).json(doctors);
    // }
    // if (
    //   queries.hasOwnProperty("firstName") &&
    //   queries.hasOwnProperty("lastName")
    // ) {
    //   console.log("Pretrazi po imenu");
    // } else if (queries.hasOwnProperty("practiceArea")) {
    //   console.log("Pretrazi po practiceArea");
    // }
  } catch (err) {
    console.log(err);
  }
}
module.exports = { create, get };
