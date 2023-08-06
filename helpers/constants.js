const ROLES = {
  ADMIN: "Admin",
  DOCTOR: "Doctor",
};

const STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELED: "Canceled"
};

const DOSE_MEASUREMENT = {
  GRAM: "g",
  MILLIGRAM: "mg",
  MICROGRAM: "mcg",
  NANOGRAM: "ng",
  MILLILITER: "mL",
  INTERNATIONAL_UNIT: "IU",
  UNIT: "U",
};

const FREQUENCY = {
  ONCE_DAILY: "Once daily",
  TWICE_DAILY: "Twice daily",
  THREE_TIMES_DAILY: "Three times daily",
  FOUR_TIMES_DAILY: "Four times daily",
  EVERY_6_HOURS: "Every 6 hours",
  EVERY_8_HOURS: "Every 8 hours",
  EVERY_12_HOURS: "Every 12 hours",
  EVERY_24_HOURS: "Every 24 hours",
  AS_NEEDED: "As needed",
  BEFORE_MEALS: "Before meals",
  AFTER_MEALS: "After meals",
  BEDTIME: "Bedtime",
  EVERY_OTHER_DAY: "Every other day",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
};

module.exports = {
  ROLES, STATUS, DOSE_MEASUREMENT, FREQUENCY
};
