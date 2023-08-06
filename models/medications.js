const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Medication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Medication.belongsTo(models.Patient, {
        foreignKey: "patient_id",
        onDelete: "CASCADE",
        as: "patient",
      });
    }
  }
  Medication.init(
    {

      id: {
        field: "id",
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },

      name: {
        field: "name",
        type: DataTypes.STRING,
      },

      doseValue: {
        field: "dose_value",
        type: DataTypes.FLOAT,
      },

      doseMeasurement: {
        field: "dose_measurement",
        type: DataTypes.ENUM,
        values: ["g", "mg", "mcg", "ng", "mL", "IU", "U"]
      },

      frequency: {
        field: "frequency",
        type: DataTypes.ENUM,
        values: [
          "Once daily",
          "Twice daily",
          "Three times daily",
          "Four times daily",
          "Every 6 hours",
          "Every 8 hours",
          "Every 12 hours",
          "Every 24 hours",
          "As needed",
          "Before meals",
          "After meals",
          "Bedtime",
          "Every other day",
          "Weekly",
          "Monthly",
        ]
      },

      prescribedOn: {
        field: "prescribed_on",
        type: DataTypes.DATE,
      },

      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
      },

      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,

      modelName: "Medication",
    }
  );

  return Medication;
};
