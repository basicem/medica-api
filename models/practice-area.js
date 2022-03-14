const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PracticeArea extends Model {
    static associate(models) {
      // define association here
      this.hasMany(models.DoctorPracticeArea, {
        as: "practiceArea",
        foreignKey: "practice_area_id",
      });
    }
  }

  PracticeArea.init(
    {
      id: {
        field: "id",
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },

      name: DataTypes.STRING,

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

      tableName: "practice_area",

      modelName: "PracticeArea",
    }
  );

  return PracticeArea;
};
