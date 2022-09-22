const { MedicaError } = require("../exceptions");

const resolveError = (err, res) => {
  if (err.isJoi) {
    return res.status(400).json({ error: err.details });
  }
  if (err instanceof MedicaError) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: "Something went wrong" });
};

module.exports = {
  resolveError
};
