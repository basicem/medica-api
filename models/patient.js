const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
  }
  Patient.init(
    {

      id: {
        field: "id",
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },

      image: {
        field: "image",
        type: DataTypes.STRING,
      },

      firstName: {
        field: "first_name",
        type: DataTypes.STRING,
      },

      lastName: {
        field: "last_name",
        type: DataTypes.STRING,
      },

      address: {
        field: "address",
        type: DataTypes.STRING,
      },

      city: {
        field: "city",
        type: DataTypes.STRING,
      },

      phoneNumber: {
        field: "phone_number",
        type: DataTypes.STRING,
      },

      email: {
        field: "email",
        type: DataTypes.STRING,
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

      modelName: "Patient",
    }
  );

  return Patient;
};