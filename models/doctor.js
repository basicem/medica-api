const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    static associate(models) {
      // define association here
      this.hasMany(models.WorkingHours, {
        as: "workingHours",
        foreignKey: "doctor_id",
      });
      this.hasMany(models.DoctorPracticeArea, {
        as: "doctorPracticeArea",
        foreignKey: "doctor_id",
      });
    }
  }

  Doctor.init(
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

      title: {
        field: "title",
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

      zip: {
        field: "zip",
        type: DataTypes.STRING,
      },

      country: {
        field: "country",
        type: DataTypes.STRING,
      },

      phoneNumber: {
        field: "phone_number",
        type: DataTypes.STRING,
      },

      website: {
        field: "website",
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

      tableName: "doctor",

      modelName: "Doctor",
    }
  );

  return Doctor;
};
