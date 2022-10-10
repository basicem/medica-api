class MedicaError extends Error {}

class NotFound extends MedicaError {}

module.exports = { MedicaError, NotFound };
