const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Appointment.belongsTo(models.User, {
        foreignKey: "doctor_id",
        onDelete: "CASCADE",
        as: "doctor",
      });
      Appointment.belongsTo(models.Patient, {
        foreignKey: "patient_id",
        onDelete: "CASCADE",
        as: "patient",
      });
    }
  }
  Appointment.init(
    {

      id: {
        field: "id",
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      slug: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      title: {
        field: "title",
        type: DataTypes.STRING,
      },

      description: {
        field: "description",
        type: DataTypes.STRING,
      },

      isVirtual: {
        field: "is_virtual",
        type: DataTypes.BOOLEAN,
      },

      link: {
        field: "link",
        type: DataTypes.STRING,
      },

      status: {
        field: "status",
        type: DataTypes.ENUM,
        values: ["Pending", "Canceled", "Confirmed"]
      },

      startDate: {
        field: "start_date",
        type: DataTypes.DATE
      },

      endDate: {
        field: "end_date",
        type: DataTypes.DATE
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

      modelName: "Appointment",

    }
  );

  return Appointment;
};
