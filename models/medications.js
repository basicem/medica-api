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

      dose: {
        field: "dose",
        type: DataTypes.STRING,
      },

      frequency: {
        field: "frequency",
        type: DataTypes.STRING,
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
