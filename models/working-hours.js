const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WorkingHours extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Doctor, {
        as: "workingHours",
        foreignKey: "doctor_id",
      });
    }
  }

  WorkingHours.init(
    {
      id: {
        field: "id",
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },

      day: DataTypes.STRING,

      workTimeStart: {
        field: "work_time_start",
        type: DataTypes.STRING,
      },

      workTimeEnd: {
        field: "work_time_end",
        type: DataTypes.STRING,
      },

      doctorId: {
        field: "doctor_id",
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

      tableName: "working_hours",

      modelName: "WorkingHours",
    }
  );

  return WorkingHours;
};
