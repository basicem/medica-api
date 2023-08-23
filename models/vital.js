const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Vital extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vital.init(
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
        allowNull: false,
        unique: true
      },

      unitMeasurement: {
        field: "unit_measurement",
        type: DataTypes.STRING,
        allowNull: false,
      },

      lowerLimit: {
        field: "lower_limit",
        type: DataTypes.DOUBLE,
        allowNull: false,
      },

      upperLimit: {
        field: "upper_limit",
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
        allowNull: false,
      },
    },
    {
      sequelize,

      modelName: "Vital",
    }
  );

  return Vital;
};
