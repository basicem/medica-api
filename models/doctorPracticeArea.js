const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DoctorPracticeArea extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Doctor, { foreignKey: "doctor_id" });
      this.belongsTo(models.PracticeArea, { foreignKey: "practice_area_id" });
    }
  }

  DoctorPracticeArea.init(
    {
      id: {
        field: "id",
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },

      doctorId: {
        field: "doctor_id",
        type: DataTypes.STRING,
      },

      practiceAreaId: {
        field: "practice_area_id",
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

      tableName: "doctor_practice_area",

      modelName: "DoctorPracticeArea",
    }
  );

  return DoctorPracticeArea;
};
