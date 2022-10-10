const { MedicaError, NotFound } = require("../exceptions");

const resolveError = (err, res) => {
  if (err.isJoi) {
    return res.status(400).json({ error: err.details });
  }
  if (err instanceof NotFound) {
    return res.status(404).json({ error: err.message || "Not found" });
  }
  if (err instanceof MedicaError) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: "Something went wrong" });
};

module.exports = {
  resolveError
};
