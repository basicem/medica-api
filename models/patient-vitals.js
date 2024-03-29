const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PatientVital extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PatientVital.belongsTo(models.Vital, {
        foreignKey: "vitalId",
        onDelete: "CASCADE",
        as: "vital",
      });
      PatientVital.belongsTo(models.Patient, {
        foreignKey: "patientId",
        onDelete: "CASCADE",
        as: "patient",
      });
    }
  }
  PatientVital.init(
    {

      id: {
        field: "id",
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },

      vitalId: {
        type: DataTypes.INTEGER,
        field: "vital_id",
      },

      patientId: {
        type: DataTypes.INTEGER,
        field: "patient_id",
      },

      value: {
        field: "value",
        type: DataTypes.DOUBLE,
        allowNull: false,
      },

      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
      },

      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
      },

      isArchived: {
        field: "is_archived",
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      archivedAt: {
        field: "archived_at",
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,

      modelName: "PatientVital",
    }
  );

  return PatientVital;
};
