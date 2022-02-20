const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {}

  Doctor.init(
    {
      image: DataTypes.STRING,

      title: DataTypes.STRING,

      firstName: DataTypes.STRING,

      lastName: DataTypes.STRING,

      practiceArea: DataTypes.STRING,

      adress: DataTypes.STRING,

      city: DataTypes.STRING,

      zip: DataTypes.STRING,

      country: DataTypes.STRING,

      phoneNumber: DataTypes.STRING,

      website: DataTypes.STRING,

      workingHours: DataTypes.STRING,

      email: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "doctors",
      modelName: "Doctor",
    }
  );

  return Doctor;
};
