const { Model } = require("sequelize");
const { REMINDER_STATUS } = require("../helpers/constants");

module.exports = (sequelize, DataTypes) => {
  class AppointmentReminder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AppointmentReminder.belongsTo(models.Appointment, {
        foreignKey: "appointmentId",
        onDelete: "CASCADE",
        as: "appointment",
      });
    }
  }
  AppointmentReminder.init(
    {

      id: {
        field: "id",
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },

      appointmentId: {
        type: DataTypes.INTEGER,
        field: "appointment_id",
      },

      status: {
        field: "status",
        type: DataTypes.ENUM,
        allowNull: false,
        values: Object.values(REMINDER_STATUS),
      },

      error: {
        field: "error",
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      minutes: {
        field: "minutes",
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      executeAt: {
        field: "execute_at",
        type: DataTypes.DATE,
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

      modelName: "AppointmentReminder",
    }
  );

  return AppointmentReminder;
};
