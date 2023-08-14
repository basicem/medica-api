const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PatientVitals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PatientVitals.belongsTo(models.Vital, {
        foreignKey: "vital_id",
        onDelete: "CASCADE",
        as: "vital",
      });
      PatientVitals.belongsTo(models.Patient, {
        foreignKey: "patient_id",
        onDelete: "CASCADE",
        as: "patient",
      });
    }
  }
  PatientVitals.init(
    {

      id: {
        field: "id",
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },

      value: {
        field: "unit_measurement",
        type: DataTypes.DOUBLE,
        allowNull: false,
      },

      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
      },

      isArchived: {
        field: "is_archived",
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      archivedAt: {
        field: "archived_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,

      modelName: "PatientVitals",
    }
  );

  return PatientVitals;
};
